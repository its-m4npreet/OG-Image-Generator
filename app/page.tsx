'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 } as const,
  },
} as const;

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else if (status !== "loading") {
      setIsReady(true);
    }
  }, [status, router]);

  if (!isReady) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-black" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 p-6 text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-6"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold"
        >
          OG Studio
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-lg text-neutral-600"
        >
          Create stunning OG images
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex gap-3"
        >
          <Link
            className="rounded-sm bg-primary px-4 py-2 text-white transition-all hover:bg-primary/80"
            href="/login"
          >
            Get Started
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
