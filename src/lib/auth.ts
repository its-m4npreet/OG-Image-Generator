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
  // ✅ FIX 1: Connect NextAuth to your PostgreSQL pool
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
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  // ✅ FIX 2: When using a DB adapter, use "database" strategy 
  // OR keep "jwt" but manually forward the user id from the DB
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // ✅ FIX 3: user object is only populated on first sign-in
      // account is only available at sign-in too
      if (user) {
        token.id = user.id;         // persisted DB id
      }
      if (account) {
        token.provider = account.provider; // "github" | "google"
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as SessionUser;
        sessionUser.id = token.id as string;
        sessionUser.provider = token.provider as string | undefined;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:8080";

      if (url.startsWith("/")) return `${baseUrl}${url}`;
      const urlOrigin = new URL(url).origin;
      if (urlOrigin === baseUrl || urlOrigin === frontendUrl) return url;
      return baseUrl;
    },
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
  },
};