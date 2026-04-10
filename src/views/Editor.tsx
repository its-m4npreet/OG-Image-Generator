import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  Hexagon, Download, Share2, ArrowLeft, Type, Palette,
  ChevronLeft, ChevronRight, Wand2, Link2, Image as ImageIcon, Trash2,
} from "lucide-react";

interface CanvasImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const gradients = [
  "from-primary/30 to-secondary/10",
  "from-primary/40 to-primary/5",
  "from-secondary/20 to-primary/10",
  "from-primary/20 via-card to-secondary/20",
  "from-purple-600/30 to-blue-600/10",
  "from-orange-500/20 to-pink-600/10",
  "from-emerald-500/20 to-cyan-500/10",
  "from-rose-500/20 to-amber-500/10",
  "from-blue-600/30 to-cyan-500/20",
  "from-indigo-600/30 to-purple-500/20",
  "from-pink-500/30 to-rose-500/20",
  "from-amber-500/30 to-orange-500/20",
  "from-green-500/30 to-emerald-500/20",
  "from-teal-500/30 to-cyan-500/20",
  "from-violet-600/30 to-indigo-600/20",
  "from-fuchsia-600/30 to-pink-500/20",
  // Light gradients
  "from-purple-200/40 to-pink-100/20",
  "from-blue-100/40 to-cyan-100/20",
  "from-yellow-100/40 to-orange-100/20",
  "from-green-100/40 to-emerald-100/20",
];

const solidColors = [
  // Dark colors
  "bg-slate-700",
  "bg-gray-800",
  "bg-zinc-800",
  "bg-neutral-800",
  "bg-stone-800",
  "bg-red-700",
  "bg-orange-700",
  "bg-amber-700",
  "bg-yellow-700",
  "bg-lime-700",
  "bg-green-700",
  "bg-emerald-700",
  "bg-teal-700",
  "bg-cyan-700",
  "bg-blue-700",
  "bg-indigo-700",
  "bg-violet-700",
  "bg-purple-700",
  "bg-fuchsia-700",
  "bg-pink-700",
  "bg-rose-700",
  // Light colors
  "bg-slate-100",
  "bg-gray-100",
  "bg-red-100",
  "bg-orange-100",
  "bg-amber-100",
  "bg-yellow-100",
  "bg-lime-100",
  "bg-green-100",
  "bg-emerald-100",
  "bg-teal-100",
  "bg-cyan-100",
  "bg-blue-100",
  "bg-indigo-100",
  "bg-violet-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-rose-100",
];

// Color hex mapping for Tailwind classes
const colorHexMap: Record<string, string> = {
  "bg-slate-700": "#3f3f46",
  "bg-gray-800": "#1f2937",
  "bg-zinc-800": "#27272a",
  "bg-neutral-800": "#262626",
  "bg-stone-800": "#292524",
  "bg-red-700": "#b91c1c",
  "bg-orange-700": "#c2410c",
  "bg-amber-700": "#b45309",
  "bg-yellow-700": "#a16207",
  "bg-lime-700": "#4d7c0f",
  "bg-green-700": "#15803d",
  "bg-emerald-700": "#047857",
  "bg-teal-700": "#0d9488",
  "bg-cyan-700": "#0e7490",
  "bg-blue-700": "#1d4ed8",
  "bg-indigo-700": "#4338ca",
  "bg-violet-700": "#7c3aed",
  "bg-purple-700": "#a855f7",
  "bg-fuchsia-700": "#d946ef",
  "bg-pink-700": "#ec4899",
  "bg-rose-700": "#e11d48",
  "bg-slate-100": "#f1f5f9",
  "bg-gray-100": "#f3f4f6",
  "bg-red-100": "#fee2e2",
  "bg-orange-100": "#ffedd5",
  "bg-amber-100": "#fef3c7",
  "bg-yellow-100": "#fef08a",
  "bg-lime-100": "#f1f5e0",
  "bg-green-100": "#dcfce7",
  "bg-emerald-100": "#d1fae5",
  "bg-teal-100": "#ccfbf1",
  "bg-cyan-100": "#cffafe",
  "bg-blue-100": "#dbeafe",
  "bg-indigo-100": "#e0e7ff",
  "bg-violet-100": "#ede9fe",
  "bg-purple-100": "#f3e8ff",
  "bg-pink-100": "#fce7f3",
  "bg-rose-100": "#ffe4e6",
};

const fontOptions = ["Inter", "Georgia", "monospace"];

// CSS Gradient mapping for color picker display
const gradientCSSMap = [
  "linear-gradient(to bottom right, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.1))",
  "linear-gradient(to bottom right, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.05))",
  "linear-gradient(to bottom right, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.1))",
  "linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgb(24, 24, 27), rgba(147, 51, 234, 0.2))",
  "linear-gradient(to bottom right, rgba(147, 112, 219, 0.3), rgba(37, 99, 235, 0.1))",
  "linear-gradient(to bottom right, rgba(249, 115, 22, 0.2), rgba(233, 64, 87, 0.1))",
  "linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(34, 197, 94, 0.1))",
  "linear-gradient(to bottom right, rgba(244, 63, 94, 0.2), rgba(251, 146, 60, 0.1))",
  "linear-gradient(to bottom right, rgba(37, 99, 235, 0.3), rgba(34, 197, 94, 0.2))",
  "linear-gradient(to bottom right, rgba(79, 70, 229, 0.3), rgba(126, 34, 206, 0.2))",
  "linear-gradient(to bottom right, rgba(236, 72, 153, 0.3), rgba(244, 63, 94, 0.2))",
  "linear-gradient(to bottom right, rgba(251, 146, 60, 0.3), rgba(249, 115, 22, 0.2))",
  "linear-gradient(to bottom right, rgba(34, 197, 94, 0.3), rgba(16, 185, 129, 0.2))",
  "linear-gradient(to bottom right, rgba(20, 184, 166, 0.3), rgba(34, 211, 238, 0.2))",
  "linear-gradient(to bottom right, rgba(109, 40, 217, 0.3), rgba(79, 70, 229, 0.2))",
  "linear-gradient(to bottom right, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.2))",
  // Light gradients
  "linear-gradient(to bottom right, rgba(216, 180, 254, 0.4), rgba(251, 228, 228, 0.2))",
  "linear-gradient(to bottom right, rgba(219, 234, 254, 0.4), rgba(206, 250, 254, 0.2))",
  "linear-gradient(to bottom right, rgba(254, 243, 199, 0.4), rgba(254, 227, 198, 0.2))",
  "linear-gradient(to bottom right, rgba(220, 252, 231, 0.4), rgba(209, 250, 229, 0.2))",
];

// Light background detection
const isLightBackground = (backgroundType: string, selectedGradient: number, selectedSolidColor: string | null): boolean => {
  if (backgroundType === "gradient") {
    // Light gradients are indices 16-19
    return selectedGradient >= 16;
  } else {
    // Light solid colors are at indices 21+ (bg-*-100)
    return selectedSolidColor?.includes("-100") ?? false;
  }
};

const Editor = () => {
  const [title, setTitle] = useState("Your Amazing Blog Title");
  const [subtitle, setSubtitle] = useState("A compelling description that captures attention");
  const [author, setAuthor] = useState("Author Name");
  const [selectedGradient, setSelectedGradient] = useState(0);
  const [selectedSolidColor, setSelectedSolidColor] = useState<string | null>(null);
  const [backgroundType, setBackgroundType] = useState<"gradient" | "solid">("gradient");
  const [noiseLevel, setNoiseLevel] = useState(0); // 0-100 range
  const [selectedFont, setSelectedFont] = useState(0);
  const [fontSize, setFontSize] = useState(40);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [images, setImages] = useState<CanvasImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const newImage: CanvasImage = {
          id: `img-${Date.now()}-${Math.random()}`,
          src,
          x: 50,
          y: 50,
          width: 200,
          height: 150,
        };
        setImages([...images, newImage]);
        setSelectedImage(newImage.id);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateImage = (id: string, updates: Partial<CanvasImage>) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id !== id) return img;
        
        const updated = { ...img, ...updates };
        
        // Boundary constraints
        updated.x = Math.max(0, Math.min(updated.x, 900 - updated.width));
        updated.y = Math.max(0, Math.min(updated.y, 630 - updated.height));
        updated.width = Math.max(50, Math.min(updated.width, 900));
        updated.height = Math.max(50, Math.min(updated.height, 630));
        
        return updated;
      })
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setLogo(src);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const deleteLogo = () => {
    setLogo(null);
  };

  const deleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedImage(null);
  };

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
            {/* <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Wand2 className="h-4 w-4 text-secondary" /> AI Assist
              </h3>
              <Button variant="outline" size="sm" className="w-full mb-2 text-xs">
                Generate Title from Keywords
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Suggest Color Palette
              </Button>
            </div> */}

            {/* <Separator className="bg-border" /> */}

            {/* Logo Upload Section */}
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                Logo
              </h3>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs mb-3"
                onClick={() => logoInputRef.current?.click()}
              >
                {logo ? "Change Logo" : "+ Add Logo"}
              </Button>

              {/* Logo Preview */}
              {logo && (
                <div className="bg-background rounded-lg p-2 border border-border flex items-center justify-between">
                  <img src={logo} alt="logo" className="h-10 w-10 object-contain" />
                  <button
                    onClick={deleteLogo}
                    className="p-1 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </div>
              )}
            </div>

            <Separator className="bg-border" />

            {/* Image Upload Section */}
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <ImageIcon className="h-4 w-4" /> Images
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs mb-3"
                onClick={() => fileInputRef.current?.click()}
              >
                + Add Image
              </Button>

              {/* Images List */}
              {images.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                        selectedImage === img.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      onClick={() => setSelectedImage(img.id)}
                    >
                      <img
                        src={img.src}
                        alt="canvas"
                        className="w-6 h-6 rounded object-cover"
                      />
                      <span className="text-xs text-muted-foreground flex-1 truncate">
                        Image
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(img.id);
                        }}
                        className="p-0.5 hover:bg-destructive/20 rounded transition-colors"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
            className={`w-full max-w-[900px] aspect-[1200/630] rounded-xl border border-border shadow-2xl relative overflow-hidden flex items-center justify-center`}
            style={{
              fontFamily: fontOptions[selectedFont],
              ...(backgroundType === "gradient"
                ? {
                    backgroundImage: noiseLevel > 0
                      ? `${gradientCSSMap[selectedGradient]}, url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='1' result='noise'/%3E%3C/filter%3E%3Crect width='100' height='100' fill='%23000000' opacity='${Math.min((noiseLevel / 100) * 0.5, 0.5)}' filter='url(%23n)'/%3E%3C/svg%3E")`
                      : gradientCSSMap[selectedGradient],
                    backgroundSize: noiseLevel > 0 ? "100% 100%, 100px 100px" : "100% 100%",
                  }
                : {
                    backgroundColor: selectedSolidColor ? colorHexMap[selectedSolidColor] || "#ffffff" : "#ffffff",
                    backgroundImage: noiseLevel > 0
                      ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='1' result='noise'/%3E%3C/filter%3E%3Crect width='100' height='100' fill='%23000000' opacity='${Math.min((noiseLevel / 100) * 0.5, 0.5)}' filter='url(%23n)'/%3E%3C/svg%3E")`
                      : "none",
                    backgroundSize: "100px 100px",
                  }),
              backgroundRepeat: "repeat",
              backgroundBlendMode: noiseLevel > 0 ? "overlay" : "normal",
            }}
          >
            {/* Render Images */}
            {images.map((img) => (
              <div
                key={img.id}
                className="absolute"
                style={{
                  left: `${(img.x / 900) * 100}%`,
                  top: `${(img.y / 630) * 100}%`,
                  width: `${(img.width / 900) * 100}%`,
                  height: `${(img.height / 630) * 100}%`,
                }}
              >
                <img
                  src={img.src}
                  alt="canvas element"
                  className="w-full h-full object-cover rounded"
                  style={{ userSelect: "none" }}
                />
              </div>
            ))}

            {/* Logo */}
            {logo && (
              <div className="absolute top-4 left-4 flex items-center justify-center">
                <img
                  src={logo}
                  alt="logo"
                  className="h-12 w-12 object-contain"
                  style={{ userSelect: "none" }}
                />
              </div>
            )}

            {/* Text Content */}
            <div className="text-center p-8 md:p-12 space-y-4 relative z-10">
              <h2
                className={`font-bold leading-tight ${
                  isLightBackground(backgroundType, selectedGradient, selectedSolidColor)
                    ? "text-black"
                    : "text-foreground"
                }`}
                style={{ fontSize: `${fontSize * 0.6}px` }}
              >
                {title}
              </h2>
              <p
                className={`text-sm md:text-base max-w-lg mx-auto ${
                  isLightBackground(backgroundType, selectedGradient, selectedSolidColor)
                    ? "text-gray-800"
                    : "text-muted-foreground"
                }`}
              >
                {subtitle}
              </p>
              <div className="flex items-center justify-center gap-2 pt-4">
                <div
                  className="w-7 h-7 rounded-full"
                  style={{
                    backgroundColor: isLightBackground(backgroundType, selectedGradient, selectedSolidColor)
                      ? "rgba(0, 0, 0, 0.2)"
                      : "rgba(59, 130, 246, 0.3)",
                  }}
                />
                <span
                  className={`text-sm ${
                    isLightBackground(backgroundType, selectedGradient, selectedSolidColor)
                      ? "text-gray-800"
                      : "text-muted-foreground"
                  }`}
                >
                  {author}
                </span>
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
          <div className="p-4 space-y-6 w-80 overflow-y-auto">
            {/* Image Controls */}
            {selectedImage && images.find((img) => img.id === selectedImage) && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" /> Image
                    </h3>
                    <button
                      onClick={() => deleteImage(selectedImage)}
                      className="p-1 hover:bg-destructive/20 rounded transition-colors"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </div>

                  {/* Position & Size Controls */}
                  <div className="bg-background rounded-lg p-3 border border-border space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">X Position</Label>
                      <Input
                        type="number"
                        value={Math.round(images.find((img) => img.id === selectedImage)?.x || 0)}
                        onChange={(e) =>
                          updateImage(selectedImage, { x: Number(e.target.value) })
                        }
                        className="mt-1 bg-card border-border text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Y Position</Label>
                      <Input
                        type="number"
                        value={Math.round(images.find((img) => img.id === selectedImage)?.y || 0)}
                        onChange={(e) =>
                          updateImage(selectedImage, { y: Number(e.target.value) })
                        }
                        className="mt-1 bg-card border-border text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Width</Label>
                      <Input
                        type="number"
                        value={Math.round(images.find((img) => img.id === selectedImage)?.width || 0)}
                        onChange={(e) =>
                          updateImage(selectedImage, { width: Math.max(50, Number(e.target.value)) })
                        }
                        className="mt-1 bg-card border-border text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Height</Label>
                      <Input
                        type="number"
                        value={Math.round(images.find((img) => img.id === selectedImage)?.height || 0)}
                        onChange={(e) =>
                          updateImage(selectedImage, { height: Math.max(50, Number(e.target.value)) })
                        }
                        className="mt-1 bg-card border-border text-xs"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-border" />
              </>
            )}

            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Palette className="h-4 w-4" /> Style
              </h3>

              {/* Background Type Toggle */}
              <Label className="text-xs text-muted-foreground mb-2 block">Background</Label>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setBackgroundType("gradient")}
                  className={`flex-1 py-1.5 px-2 text-xs rounded-lg border transition-all duration-150 ${
                    backgroundType === "gradient"
                      ? "border-primary bg-primary/10 text-foreground font-medium"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  Gradient
                </button>
                <button
                  onClick={() => setBackgroundType("solid")}
                  className={`flex-1 py-1.5 px-2 text-xs rounded-lg border transition-all duration-150 ${
                    backgroundType === "solid"
                      ? "border-primary bg-primary/10 text-foreground font-medium"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  Solid
                </button>
              </div>

              {/* Gradients */}
              {backgroundType === "gradient" && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Gradient Colors</Label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {gradients.map((g, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedGradient(i)}
                        className={`aspect-square rounded-md border transition-all duration-150 ${
                          selectedGradient === i ? "border-primary ring-2 ring-primary" : "border-border hover:border-muted-foreground"
                        }`}
                        style={{ background: gradientCSSMap[i] }}
                        title={`Gradient ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Solid Colors */}
              {backgroundType === "solid" && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Solid Colors</Label>
                  <div className="grid grid-cols-7 gap-1.5">
                    {solidColors.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSolidColor(color)}
                        className={`aspect-square rounded-md ${color} border-2 transition-all duration-150 ${
                          selectedSolidColor === color ? "border-white ring-2 ring-white" : "border-border hover:border-gray-400"
                        }`}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Separator className="bg-border my-3" />

              {/* Noise Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">Noise Overlay</Label>
                  <span className="text-xs text-primary font-medium">{noiseLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={noiseLevel}
                  onChange={(e) => setNoiseLevel(Number(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
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
