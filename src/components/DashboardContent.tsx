'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

interface DashboardContentProps {
  displayName: string;
  fallbackLetter: string;
  userImage?: string | null;
  email?: string;
}

export default function DashboardContent({
  displayName,
  fallbackLetter,
  userImage,
  email,
}: DashboardContentProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-3 text-center w-full"
    >
      <motion.div variants={itemVariants}>
        <Avatar className="h-16 w-16">
          <AvatarImage alt={displayName} src={userImage ?? ""} />
          <AvatarFallback>{fallbackLetter}</AvatarFallback>
        </Avatar>
      </motion.div>

      <motion.h1 variants={itemVariants} className="text-3xl font-bold">
        Dashboard
      </motion.h1>

      <motion.p variants={itemVariants} className="text-lg">
        Welcome, {displayName}
      </motion.p>

      <motion.p variants={itemVariants} className="text-sm text-neutral-500">
        You are authenticated with NextAuth.
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-col gap-3 w-full max-w-xs pt-4">
        <motion.div variants={buttonVariants}>
          <Button asChild className="w-full" variant="default" size="lg">
            <Link href="/editor">Create OG Image</Link>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
