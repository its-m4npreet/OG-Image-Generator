import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import { Hexagon } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <footer className="border-t border-border py-12">
        <div className="container px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hexagon className="h-5 w-5 text-primary" />
            <span className="text-sm">OG Studio © 2026</span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered Open Graph image generation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
