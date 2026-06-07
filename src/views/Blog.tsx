import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Hexagon, ArrowLeft } from "lucide-react";
import { posts } from "@/data/blog.tsx";
import { Skeleton } from "@/components/ui/skeleton";

const Blog = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-12">
          <Link
            to="/"
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
          <h1 className="text-sm font-medium text-foreground">Blog</h1>
        </div>

        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-3 w-24 mb-3" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <article key={post.slug}>
                <time className="text-xs text-muted-foreground/40 font-mono uppercase tracking-wider">
                  {post.date}
                </time>
                <h2 className="text-xl font-semibold text-foreground mt-2 mb-2">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground/60 leading-relaxed">
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
