import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] rounded-full bg-primary/15 blur-[120px]" />
      </div>
      <div className="absolute top-20 right-1/4 w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[100px]" />

      <div className="container relative z-10 flex flex-col items-center text-center gap-8 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          AI-Powered OG Image Generation
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]"
        >
          Create Stunning OG Images{" "}
          <span className="text-gradient">in Seconds</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl"
        >
          Design beautiful Open Graph images with AI-powered tools. Choose from premium templates, customize with a visual editor, and export instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button variant="hero" size="lg" asChild>
            <Link to="/signup">
              Start Creating <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <Link to="/editor">Try the Editor</Link>
          </Button>
        </motion.div>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-8 w-full max-w-4xl"
        >
          <div className="glass rounded-2xl p-1.5">
            <div className="bg-card rounded-xl overflow-hidden">
              <div className="aspect-[1200/630] bg-gradient-to-br from-primary/20 via-card to-secondary/10 flex items-center justify-center relative dot-grid">
                <div className="text-center space-y-3 ">
                  <img src="/public/og.png" alt="ogImage" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
