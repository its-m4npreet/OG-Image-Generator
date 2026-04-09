import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "../src/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-bold">OG Studio Auth</h1>

      {session ? (
        <p>
          Signed in as <strong>{session.user?.email}</strong>
        </p>
      ) : (
        <p>You are not signed in.</p>
      )}

      <div className="flex gap-3">
        <Link className="rounded-md bg-black px-4 py-2 text-white" href="/login">
          Login
        </Link>
        <Link className="rounded-md border px-4 py-2" href="/dashboard">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
