"use client";

import Link from "next/link";
import { Hexagon, ArrowLeft } from "lucide-react";

interface StaticPageProps {
  title: string;
  children: React.ReactNode;
}

const StaticPage = ({ title, children }: StaticPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground/60 hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <Hexagon className="h-5 w-5 text-primary" />
          <span className="font-mono text-sm font-bold tracking-wide">OG Studio</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-8">{title}</h1>

        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground/70 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
