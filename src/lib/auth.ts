import { NextAuthOptions, DefaultSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { pool } from "./postgres";

type SessionUser = NonNullable<DefaultSession["user"]> & {
  id?: string;
  provider?: string;
  role?: string;
  isPremium?: boolean;
};

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

export const authOptions: NextAuthOptions = {
  adapter: PostgresAdapter(pool),

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
      httpOptions: {
        timeout: 15000,
      },
      async profile(profile) {
        console.log("📧 Google profile received:", { 
          id: profile.sub, 
          email: profile.email,
          name: profile.name 
        });
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("✅ signIn callback:", { 
          userId: user.id, 
          email: user.email,
          provider: account?.provider 
        });
        return true;
      } catch (error) {
        console.error("❌ signIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      // For initial sign in, add user data to token
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        
        // Fetch role and premium status from database
        try {
          const result = await pool.query(
            "SELECT role, is_premium FROM users WHERE id = $1",
            [user.id]
          );
          if (result.rows.length > 0) {
            token.role = result.rows[0].role;
            token.isPremium = result.rows[0].is_premium;
          } else {
            token.role = "user";
            token.isPremium = false;
          }
        } catch (error) {
          console.error("❌ Error fetching user data:", error);
          token.role = "user";
          token.isPremium = false;
        }
      }
      
      return token;
    },

    async session({ session, token }) {
      try {
        console.log("✅ session callback:", { 
          userId: token.sub, 
          email: token.email,
          role: token.role,
          isPremium: token.isPremium,
        });
        if (session.user) {
          const sessionUser = session.user as SessionUser;
          sessionUser.id = token.sub;
          sessionUser.role = token.role as string;
          sessionUser.image = token.picture as string;
          sessionUser.isPremium = token.isPremium as boolean;
        }
        return session;
      } catch (error) {
        console.error("❌ session callback error:", error);
        throw error;
      }
    },

    async redirect({ url, baseUrl }) {
      try {
        console.log("✅ redirect callback:", { url, baseUrl });
        
        if (url.startsWith("/")) {
          return `${baseUrl}${url}`;
        }

        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);

        if (urlObj.origin === baseUrlObj.origin) {
          return url;
        }
      } catch (e) {
        console.warn("⚠️ redirect callback warning:", e);
      }

      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};