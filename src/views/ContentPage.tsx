"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Hexagon, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const pages: Record<string, { title: string; content: React.ReactNode }> = {
  about: {
    title: "About",
    content: (
      <>
        <p>
          OG Studio is a free, open-source tool for creating beautiful Open Graph images. 
          We believe every link shared on the internet deserves a stunning preview.
        </p>
        <p>
          Our mission is to make OG image creation accessible to everyone — from solo 
          bloggers to large marketing teams — with an intuitive drag-and-drop editor, 
          beautiful templates, and powerful customization options.
        </p>
      </>
    ),
  },
  "privacy-policy": {
    title: "Privacy Policy",
    content: (
      <>
        <p>Last updated: June 2026</p>
        <p>
          OG Studio respects your privacy. We only collect data necessary to provide
          and improve our service. We do not sell your personal information to third parties.
        </p>
        <h3 className="text-foreground font-semibold text-base">Information We Collect</h3>
        <p>
          When you sign in, we store your email address and display name. Images you create
          are processed in your browser and are not stored on our servers unless you explicitly save them.
        </p>
        <h3 className="text-foreground font-semibold text-base">Cookies</h3>
        <p>
          We use essential cookies for authentication and basic functionality. We do not use
          tracking cookies or third-party analytics that share data with advertisers.
        </p>
      </>
    ),
  },
  "terms-of-service": {
    title: "Terms of Service",
    content: (
      <>
        <p>Last updated: June 2026</p>
        <p>
          By using OG Studio, you agree to these terms. If you do not agree, please
          do not use our service.
        </p>
        <p>
          You retain all rights to the images you create using OG Studio. We claim no
          ownership over your content. You are responsible for ensuring your use of our
          tool complies with applicable laws and regulations.
        </p>
        <p>
          OG Studio is provided "as is" without warranty of any kind. We are not liable
          for any damages arising from the use of our service.
        </p>
      </>
    ),
  },
  "cookie-policy": {
    title: "Cookie Policy",
    content: (
      <>
        <p>OG Studio uses a minimal set of cookies to provide a functional experience.</p>
        <h3 className="text-foreground font-semibold text-base">Essential Cookies</h3>
        <p>
          These cookies are required for authentication and keeping you signed in
          across sessions. They cannot be disabled.
        </p>
        <h3 className="text-foreground font-semibold text-base">No Tracking Cookies</h3>
        <p>
          We do not use analytics or advertising cookies. Your visit is not tracked
          by third-party services.
        </p>
      </>
    ),
  },
  contact: {
    title: "Contact",
    content: (
      <>
        <p>
          Have questions, feedback, or want to report a bug? We would love to hear from you.
        </p>
        <p>
          Email us at{" "}
          <a href="mailto:hello@ogstudio.app" className="text-primary hover:underline">
            hello@ogstudio.app
          </a>
        </p>
        <p>
          You can also open an issue on our{" "}
          <a href="https://github.com" className="text-primary hover:underline">
            GitHub repository
          </a>
          .
        </p>
      </>
    ),
  },
  careers: {
    title: "Careers",
    content: (
      <>
        <p>
          We are building the future of Open Graph image generation and we want you
          to be part of it.
        </p>
        <p>
          We are currently a small team and are not actively hiring, but we are always
          open to connecting with talented people. Email us at{" "}
          <a href="mailto:careers@ogstudio.app" className="text-primary hover:underline">
            careers@ogstudio.app
          </a>
          .
        </p>
      </>
    ),
  },
  "press-kit": {
    title: "Press Kit",
    content: (
      <>
        <p>
          Download our branding assets for use in articles, presentations, and media coverage.
        </p>
        <p>
          OG Studio logo, screenshots, and brand guidelines are available for press use.
          Email{" "}
          <a href="mailto:press@ogstudio.app" className="text-primary hover:underline">
            press@ogstudio.app
          </a>{" "}
          for access.
        </p>
      </>
    ),
  },
  "api-docs": {
    title: "API Documentation",
    content: (
      <>
        <p>
          OG Studio provides a simple API for generating Open Graph images programmatically.
          This allows you to automate OG image creation as part of your build process or
          content pipeline.
        </p>
        <p>
          Our API is currently in development. To get early access, email{" "}
          <a href="mailto:api@ogstudio.app" className="text-primary hover:underline">
            api@ogstudio.app
          </a>
          .
        </p>
      </>
    ),
  },
  changelog: {
    title: "Changelog",
    content: (
      <>
        <p>Keep track of updates, new features, and improvements to OG Studio.</p>
        <div className="space-y-6 mt-8">
          <div>
            <time className="text-xs text-muted-foreground/40 font-mono uppercase tracking-wider">
              June 2026
            </time>
            <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
              <li>Added new premium gradients collection</li>
              <li>Improved image shadow controls</li>
              <li>Performance optimizations for the editor</li>
            </ul>
          </div>
          <div>
            <time className="text-xs text-muted-foreground/40 font-mono uppercase tracking-wider">
              May 2026
            </time>
            <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
              <li>Initial public release</li>
              <li>Template library with 10+ designs</li>
              <li>Custom gradient and color picker</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  security: {
    title: "Security",
    content: (
      <>
        <p>
          We take the security of our platform and your data seriously.
        </p>
        <p>
          All connections to OG Studio are encrypted using TLS. Images are processed
          client-side in your browser and are not transmitted to our servers unless
          explicitly saved.
        </p>
        <p>
          To report a security vulnerability, email{" "}
          <a href="mailto:security@ogstudio.app" className="text-primary hover:underline">
            security@ogstudio.app
          </a>
          .
        </p>
      </>
    ),
  },
};

const ContentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const page = slug ? pages[slug] : null;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
          <Link href="/" className="text-primary hover:underline text-sm">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <Skeleton className="h-4 w-48 mb-12" />
          <Skeleton className="h-8 w-1/2 mb-8" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
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
            href="/"
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
          <h1 className="text-sm font-medium text-foreground">{page.title}</h1>
        </div>

        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground/70 leading-relaxed">
          {page.content}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
