import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  Hexagon, Download, Share2, ArrowLeft, Type, Palette,
  ChevronLeft, ChevronRight, Wand2, Link2,
} from "lucide-react";

const gradients = [
  "from-primary/30 to-secondary/10",
  "from-primary/40 to-primary/5",
  "from-secondary/20 to-primary/10",
  "from-primary/20 via-card to-secondary/20",
  "from-purple-600/30 to-blue-600/10",
  "from-orange-500/20 to-pink-600/10",
  "from-emerald-500/20 to-cyan-500/10",
  "from-rose-500/20 to-amber-500/10",
];

const fontOptions = ["Inter", "Georgia", "monospace"];

const Editor = () => {
  const [title, setTitle] = useState("Your Amazing Blog Title");
  const [subtitle, setSubtitle] = useState("A compelling description that captures attention");
  const [author, setAuthor] = useState("Author Name");
  const [selectedGradient, setSelectedGradient] = useState(0);
  const [selectedFont, setSelectedFont] = useState(0);
  const [fontSize, setFontSize] = useState(40);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    // In a real app, this would use html-to-image or canvas
    alert("Export feature would generate a 1200×630 PNG. Backend integration needed.");
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex items-center gap-2">
            <Hexagon className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground text-sm">OG Studio</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
          <Button variant="hero" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> Export PNG
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className={`border-r border-border bg-card shrink-0 transition-all duration-200 ${leftOpen ? "w-72" : "w-0"} overflow-hidden`}>
          <div className="p-4 space-y-6 w-72">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Type className="h-4 w-4" /> Content
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 bg-background border-border" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Subtitle</Label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="mt-1 bg-background border-border" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Author</Label>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 bg-background border-border" />
              </div>
            </div>

            <Separator className="bg-border" />

            {/* AI Section */}
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Wand2 className="h-4 w-4 text-secondary" /> AI Assist
              </h3>
              <Button variant="outline" size="sm" className="w-full mb-2 text-xs">
                Generate Title from Keywords
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Suggest Color Palette
              </Button>
            </div>

            <Separator className="bg-border" />

            {/* Link Scraper */}
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Link2 className="h-4 w-4" /> URL Scraper
              </h3>
              <div className="flex gap-2">
                <Input placeholder="https://..." className="text-xs bg-background border-border" />
                <Button variant="outline" size="sm" className="shrink-0 text-xs">Fetch</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Left toggle */}
        <button
          onClick={() => setLeftOpen(!leftOpen)}
          className="w-5 shrink-0 flex items-center justify-center border-r border-border bg-card hover:bg-accent transition-colors"
        >
          {leftOpen ? <ChevronLeft className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
        </button>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center dot-grid overflow-auto p-8">
          <div
            ref={canvasRef}
            className={`w-full max-w-[900px] aspect-[1200/630] rounded-xl bg-gradient-to-br ${gradients[selectedGradient]} border border-border shadow-2xl flex items-center justify-center relative`}
            style={{ fontFamily: fontOptions[selectedFont] }}
          >
            <div className="text-center p-8 md:p-12 space-y-4">
              <h2
                className="font-bold text-foreground leading-tight"
                style={{ fontSize: `${fontSize * 0.6}px` }}
              >
                {title}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
                {subtitle}
              </p>
              <div className="flex items-center justify-center gap-2 pt-4">
                <div className="w-7 h-7 rounded-full bg-primary/30" />
                <span className="text-sm text-muted-foreground">{author}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right toggle */}
        <button
          onClick={() => setRightOpen(!rightOpen)}
          className="w-5 shrink-0 flex items-center justify-center border-l border-border bg-card hover:bg-accent transition-colors"
        >
          {rightOpen ? <ChevronRight className="h-3 w-3 text-muted-foreground" /> : <ChevronLeft className="h-3 w-3 text-muted-foreground" />}
        </button>

        {/* Right Panel */}
        <div className={`border-l border-border bg-card shrink-0 transition-all duration-200 ${rightOpen ? "w-80" : "w-0"} overflow-hidden`}>
          <div className="p-4 space-y-6 w-80">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Palette className="h-4 w-4" /> Style
              </h3>

              {/* Gradients */}
              <Label className="text-xs text-muted-foreground">Background</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {gradients.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedGradient(i)}
                    className={`aspect-square rounded-lg bg-gradient-to-br ${g} border transition-all duration-150 ${
                      selectedGradient === i ? "border-primary ring-1 ring-primary" : "border-border hover:border-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Font */}
            <div>
              <Label className="text-xs text-muted-foreground">Font Family</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {fontOptions.map((f, i) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFont(i)}
                    className={`text-xs py-2 rounded-lg border transition-all duration-150 ${
                      selectedFont === i ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                    style={{ fontFamily: f }}
                  >
                    {f === "monospace" ? "Mono" : f}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Font Size */}
            <div>
              <Label className="text-xs text-muted-foreground">Title Size</Label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="range"
                  min={24}
                  max={64}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-xs text-muted-foreground w-8 text-right">{fontSize}</span>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Export info */}
            <div className="bg-background rounded-lg p-3 border border-border">
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Format</span>
                  <span className="text-foreground">PNG</span>
                </div>
                <div className="flex justify-between">
                  <span>Size</span>
                  <span className="text-foreground">1200 × 630</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
