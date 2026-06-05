"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 } as const,
  },
} as const;

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-6 w-full"
      >
        <motion.h1 variants={itemVariants} className="text-3xl font-bold">
          Authentication
        </motion.h1>

        {status === "loading" ? (
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-black" />
            <p className="text-neutral-600">Loading...</p>
          </motion.div>
        ) : session ? (
          <>
            <motion.p variants={itemVariants}>
              Signed in as <strong>{session.user?.email}</strong>
            </motion.p>
            <motion.button
              variants={buttonVariants}
              className="rounded-sm bg-black px-4 py-2 text-white"
              onClick={() => signOut({ callbackUrl: "/" })}
              type="button"
            >
              Sign out
            </motion.button>
          </>
        ) : (
          <motion.div variants={itemVariants} className="flex flex-col gap-3 w-full">
            <motion.button
              variants={buttonVariants}
              className="rounded-sm bg-black px-4 py-2 text-white"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              type="button"
            >
              Sign in with GitHub
            </motion.button>

            <motion.button
              variants={buttonVariants}
              className="rounded-sm border border-black px-4 py-2 text-black"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              type="button"
            >
              Sign in with Google
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
