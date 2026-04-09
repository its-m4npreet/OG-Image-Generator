"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-bold">Authentication</h1>

      {status === "loading" ? (
        <p>Loading...</p>
      ) : session ? (
        <>
          <p>
            Signed in as <strong>{session.user?.email}</strong>
          </p>
          <button
            className="rounded-md bg-black px-4 py-2 text-white"
            onClick={() => signOut({ callbackUrl: "/" })}
            type="button"
          >
            Sign out
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            className="rounded-md bg-black px-4 py-2 text-white"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            type="button"
          >
            Sign in with GitHub
          </button>

          <button
            className="rounded-md border border-black px-4 py-2 text-black"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            type="button"
          >
            Sign in with Google
          </button>
        </div>
      )}
    </main>
  );
}
