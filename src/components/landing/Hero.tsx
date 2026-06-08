import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          let start = 0;
          const step = () => {
            start += Math.ceil(target / 60);
            if (start >= target) {
              setVal(target);
              return;
            }
            setVal(start);
            requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

function OGPreviewCard() {
  return (
    <div className="aspect-[1200/630] rounded-2xl overflow-hidden bg-card">
      <img src="/og.png" alt="OG Image preview" className="w-full h-full object-cover" />
    </div>
  );
}

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-20">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.03) 49%, rgba(255,255,255,0.03) 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.03) 49%, rgba(255,255,255,0.03) 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-[820px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
          style={{
            // background: "rgba(124,58,237,0.08)",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="font-mono text-xs text-primary tracking-widest uppercase">
            Create. Customize. Share.
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight text-[#f0f0f8] mb-6"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Create Stunning OG Images 
          <em className="text-primary not-italic ml-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            in Seconds
          </em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground/60 leading-relaxed max-w-[540px] mx-auto mb-10 font-light tracking-wide"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Design beautiful Open Graph images with premium templates, a simple
          editor, and instant export for your links, blogs, and products.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-3 justify-center flex-wrap"
        >
          <Button variant="hero" size="lg" className="btn-shimmer" asChild>
            <Link href="/signup">
              Start Creating <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <Link href="/editor">Try the Editor</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-10 mt-14 flex-wrap"
        >
          {[
            { value: 12000, suffix: "+", label: "images exported" },
            { value: 40, suffix: "+", label: "premium templates" },
            { value: 98, suffix: "%", label: "satisfaction rate" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-[28px] font-bold text-[#f0f0f8] leading-none" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="font-mono text-[10px] text-muted-foreground/40 tracking-widest uppercase mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative z-10 w-full max-w-[860px] mt-16"
      >
        <div
          className="rounded-[20px] p-2"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow:
              "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.08)",
          }}
        >
          <OGPreviewCard />
        </div>
        <div
          className="absolute -bottom-16 left-[10%] right-[10%] h-16"
          style={{
            background:
              "linear-gradient(to bottom, rgba(124,58,237,0.06), transparent)",
            filter: "blur(20px)",
          }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
