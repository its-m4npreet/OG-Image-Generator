"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const index = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#09090d",
        color: "#e8e8f0",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <Navbar />
      <main>
        <Hero />
        <Features />

        {/* Social proof strip */}
        <div
          className="py-7 px-6"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <div className="max-w-[1160px] mx-auto flex items-center justify-center gap-12 flex-wrap">
            {[
              "40+ patterns built-in",
              "Gradient & solid fills",
              "No design skills needed",
              "Fully customizable",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="text-primary text-xs">&#10003;</span>
                <span className="font-mono text-[11px] text-muted-foreground/50 tracking-wide uppercase">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Testimonials />
        {/* <Pricing /> */}

        {/* CTA Banner */}
        <section className="py-[120px] px-6 relative">
          {/* <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 65%)",
              filter: "blur(70px)",
            }}
          /> */}
          <div className="max-w-[800px] mx-auto text-center relative z-10">
            <div className="flex items-center justify-center gap-2.5 mb-8">
              <div className="w-6 h-px" style={{ background: "rgba(124,58,237,0.5)" }} />
              <span className="font-mono text-[10px] text-primary/70 tracking-widest uppercase">
                Get started today
              </span>
              <div className="w-6 h-px" style={{ background: "rgba(124,58,237,0.5)" }} />
            </div>

            <h2
              className="text-[clamp(40px,6.5vw,68px)] font-extrabold leading-[1.06] tracking-tight text-[#f4f4fc] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Make every shared link  <br />look &nbsp;
              <em
                className="text-primary not-italic"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                polished
              </em>
            </h2>

            <p className="text-[15px] text-muted-foreground/40 mb-11 tracking-wide">
              Generate custom OG images for blogs, products, portfolios, and launches in seconds.
            </p>

            <div className="flex gap-3.5 justify-center items-center">
              <Button variant="hero" className="btn-shimmer" asChild>
                <Link href="/login">
                  Start for Free &rarr;
                </Link>
              </Button>
              <Link
                href="/editor"
                className="text-sm text-muted-foreground/40 hover:text-muted-foreground/80 transition-colors"
              >
                Try the editor
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default index;
