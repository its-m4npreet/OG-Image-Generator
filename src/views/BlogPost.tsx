"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Hexagon, ArrowLeft } from "lucide-react";
import { posts } from "@/data/blog";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const post = posts.find((p) => p.slug === slug);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Post not found</h1>
          <Link href="/blog" className="text-primary hover:underline text-sm">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <Skeleton className="h-4 w-64 mb-12" />
          <Skeleton className="h-3 w-24 mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-8 w-1/2 mb-8" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <span className="text-muted-foreground/20">/</span>
          <div className="flex items-center gap-2">
            <Hexagon className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm font-bold tracking-wide">OG Studio</span>
          </div>
          <span className="text-muted-foreground/20">/</span>
          <Link href="/blog" className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors">
            Blog
          </Link>
          <span className="text-muted-foreground/20">/</span>
          <h1 className="text-sm font-medium text-foreground truncate max-w-[200px]">
            {post.title}
          </h1>
        </div>

        <time className="text-xs text-muted-foreground/40 font-mono uppercase tracking-wider">
          {post.date}
        </time>
        <h1 className="text-3xl font-bold text-foreground mt-3 mb-8">{post.title}</h1>

        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground/70 leading-relaxed space-y-4">
          {post.content}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
