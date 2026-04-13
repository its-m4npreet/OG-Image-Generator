import { NextAuthOptions, DefaultSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { pool } from "./postgres";

type SessionUser = NonNullable<DefaultSession["user"]> & {
  id?: string;
  provider?: string;
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
    strategy: "database",
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
      // For initial sign in
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, user }) {
      try {
        console.log("✅ session callback:", { 
          userId: user.id, 
          email: user.email,
          role: (user as any).role 
        });
        if (session.user) {
          const sessionUser = session.user as SessionUser;
          sessionUser.id = user.id;
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
        
        // Allow relative URLs
        if (url.startsWith("/")) {
          return `${baseUrl}${url}`;
        }

        // Allow absolute URLs if they belong to the same origin as baseUrl
        // or the FRONTENDOrigin (8080)
        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);
        
        const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:8080";
        const frontendObj = new URL(frontendOrigin);

        if (urlObj.origin === baseUrlObj.origin || urlObj.origin === frontendObj.origin) {
          return url;
        }
      } catch (e) {
        console.warn("⚠️ redirect callback warning:", e);
      }

      // Default to baseUrl (home)
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};