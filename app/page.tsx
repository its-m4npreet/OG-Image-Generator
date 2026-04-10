import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "../src/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-bold">OG Studio</h1>
      <p className="text-lg text-neutral-600">Create stunning OG images</p>

      <div className="flex gap-3">
        <Link className="rounded-md bg-black px-4 py-2 text-white" href="/login">
          Get Started
        </Link>
      </div>
    </main>
  );
}
