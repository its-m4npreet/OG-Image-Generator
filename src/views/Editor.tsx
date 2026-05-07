import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import {
  Hexagon, Download, Share2, ArrowLeft, Type, Palette,
  ChevronLeft, ChevronRight, ChevronDown, Wand2, Link2, Image as ImageIcon, Trash2,
} from "lucide-react";
import { toPng, toJpeg } from "html-to-image";
import {
  gradientMap,
  gradients,
  gradientCSSMap,
  solidColors,
  colorHexMap,
  isLightColor,
  getNoiseSVG,
  isLightBackground,
} from "@/lib/colors";

interface CanvasImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number; // 0-50 for border radius
  borderWidth?: number; // 0-10 for border width
  borderColor?: string; // border color hex
}

interface LogoProperties {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
}

const fontOptions = ["Inter", "Georgia", "Arial"];

const Editor = () => {
  // Get URL parameters for template loading
  const searchParams = new URLSearchParams(window.location.search);
  
  // Extract parameters at component level
  const templateTitle = searchParams.get("title") || "Your Amazing Blog Title";
  const templateSubtitle = searchParams.get("subtitle") || "A compelling description that captures attention";
  const templateGradient = searchParams.get("gradient");
  const templateLogo = searchParams.get("logo");
  const templateImage = searchParams.get("image");
  const templateImagePosition = searchParams.get("imagePosition");
  const templateLogoPosition = searchParams.get("logoPosition");
  
  // Helper function to get initial gradient index
  const getInitialGradient = () => {
    if (!templateGradient) return 0;
    const foundIndex = gradients.findIndex(g => g === templateGradient);
    return foundIndex !== -1 ? foundIndex : 0;
  };
  
  const [title, setTitle] = useState(templateTitle);
  const [subtitle, setSubtitle] = useState(templateSubtitle);
  const [author, setAuthor] = useState("Author Name");
  const [selectedGradient, setSelectedGradient] = useState(getInitialGradient());
  const [selectedSolidColor, setSelectedSolidColor] = useState<string | null>(null);
  const [backgroundType, setBackgroundType] = useState<"gradient" | "solid">("gradient");
  const [noiseLevel, setNoiseLevel] = useState(0); // 0-100 range
  const [selectedFont, setSelectedFont] = useState(0);
  const [fontSize, setFontSize] = useState(40);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [imageControlsOpen, setImageControlsOpen] = useState(false);
  const [logoControlsOpen, setLogoControlsOpen] = useState(false);
  const [images, setImages] = useState<CanvasImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<"png" | "jpg" | "webp">("png");
  const [exportSize, setExportSize] = useState<"800x420" | "1200x630" | "1920x1008">("1200x630");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [logoProps, setLogoProps] = useState<LogoProperties>({
    x: 16,
    y: 16,
    width: 48,
    height: 48,
    borderRadius: 0,
  });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Load template data from URL parameters
  useEffect(() => {
    if (templateLogo && templateLogo.trim()) {
      // Load logo from template
      fetch(templateLogo)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = (e) => {
            setLogo(e.target?.result as string);
          };
          reader.readAsDataURL(blob);
        })
        .catch(err => console.log("Logo load skipped:", err));
    }
    
    if (templateImage && templateImage.trim()) {
      // Load template image
      fetch(templateImage)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Parse position data from URL or use defaults
            let imageX = 175, imageY = 140, imageWidth = 550, imageHeight = 350;
            
            if (templateImagePosition) {
              try {
                const pos = JSON.parse(templateImagePosition);
                imageX = pos.x || imageX;
                imageY = pos.y || imageY;
                imageWidth = pos.width || imageWidth;
                imageHeight = pos.height || imageHeight;
              } catch (err) {
                console.log("Could not parse image position:", err);
              }
            }
            
            const newImage: CanvasImage = {
              id: `template-img-${Date.now()}`,
              src: e.target?.result as string,
              x: imageX,
              y: imageY,
              width: imageWidth,
              height: imageHeight,
            };
            setImages([newImage]);
            setSelectedImage(newImage.id);
          };
          reader.readAsDataURL(blob);
        })
        .catch(err => console.log("Image load skipped:", err));
    }
  }, [templateLogo, templateImage, templateImagePosition]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        
        // Smart default positioning for uploaded images
        // Place at centered position with default size
        const newImage: CanvasImage = {
          id: `img-${Date.now()}-${Math.random()}`,
          src,
          x: 175,      // Centered horizontally on canvas (900px width)
          y: 140,      // Centered vertically on canvas (630px height)
          width: 550,  // Default width
          height: 350, // Default height
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "#000000",
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
        updated.x = Math.min(updated.x, 900 - updated.width);
        updated.y = Math.min(updated.y, 630 - updated.height);
        updated.width = Math.max(0, Math.min(updated.width, 900));
        updated.height = Math.max(0, Math.min(updated.height, 630));
        
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

  // Calculate optimal text position to avoid image overlap
  const getTextPositioning = () => {
    if (images.length === 0) {
      return { position: "absolute" as const, top: "50%", left: "50%", transform: "translate(-50%, -50%)", maxWidth: "100%" };
    }

    const image = images[0]; // Get first image
    const textHeight = 200; // Approximate text height
    const textMargin = 30;
    const imageBottom = image.y + image.height;

    // Image positioned at bottom (y >= 200) - place text at top
    if (image.y >= 200) {
      return {
        position: "absolute" as const,
        top: `${textMargin}px`,
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: "85%",
        textAlign: "center" as const,
      };
    }

    // Image on right side (x > 500) - move text to left
    if (image.x > 450) {
      const textWidth = 350;
      return {
        position: "absolute" as const,
        top: "50%",
        left: `${textMargin}px`,
        transform: "translateY(-50%)",
        maxWidth: `${textWidth}px`,
        textAlign: "left" as const,
      };
    }

    // Image on left side (x < 300) - move text to right
    if (image.x < 300) {
      const textWidth = 350;
      return {
        position: "absolute" as const,
        top: "50%",
        right: `${textMargin}px`,
        transform: "translateY(-50%)",
        maxWidth: `${textWidth}px`,
        textAlign: "right" as const,
      };
    }

    // Image in center-top area - position text at bottom
    if (imageBottom < 350) {
      return {
        position: "absolute" as const,
        bottom: `${textMargin}px`,
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: "85%",
        textAlign: "center" as const,
      };
    }

    // Default: center
    return {
      position: "absolute" as const,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "80%",
      textAlign: "center" as const,
    };
  };

  // Helper function to convert image to WebP format
  const convertToWebP = (imageDataUrl: string, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to convert to WebP"));
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageDataUrl;
    });
  };



  const handleExport = () => {
    setShowExportDialog(true);
  };

  const performExport = async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);
    try {
      // Wait for fonts to load
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Small delay to ensure all styles are computed and rendered
      await new Promise(resolve => setTimeout(resolve, 150));

      // Parse export size
      const [width, height] = exportSize.split("x").map(Number);
      
      // Clone the canvas element to avoid aspect ratio constraints
      const canvasClone = canvasRef.current.cloneNode(true) as HTMLDivElement;
      
      // Remove aspect ratio constraint and set explicit dimensions
      canvasClone.style.width = `${width}px`;
      canvasClone.style.height = `${height}px`;
      canvasClone.style.maxWidth = 'none';
      
      // Temporarily add to DOM to ensure proper rendering
      document.body.appendChild(canvasClone);
      
      // Get the appropriate export function based on format
      let blob: Blob;
      const exportOptions = {
        pixelRatio: 2,
        cacheBust: true,
        width,
        height,
      };

      if (exportFormat === "png") {
        const dataUrl = await toPng(canvasClone, exportOptions);
        const response = await fetch(dataUrl);
        blob = await response.blob();
      } else if (exportFormat === "jpg") {
        const dataUrl = await toJpeg(canvasClone, { ...exportOptions, quality: 0.95 });
        const response = await fetch(dataUrl);
        blob = await response.blob();
      } else {
        // For WebP: first generate PNG, then convert to WebP
        const pngDataUrl = await toPng(canvasClone, exportOptions);
        blob = await convertToWebP(pngDataUrl, 0.8);
      }
      
      // Remove clone from DOM
      document.body.removeChild(canvasClone);
      
      // Create a temporary URL and trigger download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `og-image-${Date.now()}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      setShowExportDialog(false);
    } catch (error) {
      console.error("Failed to export image:", error);
      alert("Failed to export image. Please try again.");
    } finally {
      setIsExporting(false);
    }
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
            <Download className="h-4 w-4 mr-1" /> Export {exportFormat.toUpperCase()}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left Panel */}
        <div className={`border-r border-border bg-card shrink-0 transition-all duration-200 ${leftOpen ? "w-72" : "w-0"} overflow-hidden h-full`}>
          <div 
            className="p-4 space-y-6 w-72 overflow-y-auto no-scrollbar h-full"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } as React.CSSProperties}
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
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
        <div className="flex-1 flex items-center justify-center dot-grid overflow-auto p-8 h-full">
          <div
            ref={canvasRef}
            className={`w-full max-w-[900px] aspect-[1200/630] shadow-2xl relative overflow-hidden flex items-center justify-center`}
            style={{
              fontFamily: fontOptions[selectedFont],
              ...(backgroundType === "gradient"
                ? {
                    backgroundImage: noiseLevel > 0
                      ? `${gradientCSSMap[selectedGradient]}, ${getNoiseSVG(noiseLevel)}`
                      : gradientCSSMap[selectedGradient],
                    backgroundSize: noiseLevel > 0 ? "100% 100%, 100px 100px" : "100% 100%",
                  }
                : {
                    backgroundColor: selectedSolidColor ? colorHexMap[selectedSolidColor] || "#ffffff" : "#ffffff",
                    backgroundImage: getNoiseSVG(noiseLevel, selectedSolidColor ? colorHexMap[selectedSolidColor] : "#ffffff"),
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
                className={`absolute transition-all duration-200 ${
                  selectedImage === img.id ? "ring-2 ring-primary shadow-xl" : "shadow-lg hover:shadow-2xl"
                }`}
                style={{
                  left: `${(img.x / 900) * 100}%`,
                  top: `${(img.y / 630) * 100}%`,
                  width: `${(img.width / 900) * 100}%`,
                  height: `${(img.height / 630) * 100}%`,
                  cursor: "pointer",
                }}
                onClick={() => setSelectedImage(img.id)}
              >
                <img
                  src={img.src}
                  alt="canvas element"
                  className="w-full h-full object-cover"
                  style={{
                    userSelect: "none",
                    borderRadius: `${img.borderRadius || 0}px`,
                    border: img.borderWidth && img.borderWidth > 0 
                      ? `${img.borderWidth}px solid ${img.borderColor || "#000000"}`
                      : "none",
                  }}
                />
              </div>
            ))}

            {/* Logo */}
            {logo && (
              <div
                className="absolute flex items-center justify-center transition-all duration-200"
                style={{
                  left: `${logoProps.x}px`,
                  top: `${logoProps.y}px`,
                  width: `${logoProps.width}px`,
                  height: `${logoProps.height}px`,
                }}
              >
                <img
                  src={logo}
                  alt="logo"
                  className="w-full h-full object-contain"
                  style={{
                    userSelect: "none",
                    borderRadius: `${logoProps.borderRadius || 0}px`,
                  }}
                />
              </div>
            )}

            {/* Text Content */}
            <div
              style={{
                ...getTextPositioning(),
                zIndex: 10,
                padding: "2rem",
              }}
              className="space-y-4"
            >
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
              <div className="flex items-center gap-2 pt-4" style={{
                justifyContent: getTextPositioning().textAlign === "center" ? "center" : getTextPositioning().textAlign === "left" ? "flex-start" : "flex-end"
              }}>
                {/* <div
                  className="w-7 h-7 rounded-full"
                  style={{
                    backgroundColor: isLightBackground(backgroundType, selectedGradient, selectedSolidColor)
                      ? "rgba(0, 0, 0, 0.2)"
                      : "rgba(59, 130, 246, 0.3)",
                  }}
                /> */}
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
        <div className={`border-l border-border bg-card shrink-0 transition-all duration-200 ${rightOpen ? "w-80" : "w-0"} overflow-hidden h-full`}>
          <div 
            className="p-4 space-y-6 w-80 overflow-y-auto no-scrollbar h-full"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } as React.CSSProperties}
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {/* Style / Colors - At Top */}
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
                  <div className="grid grid-cols-8 gap-1">
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

            {/* Image Controls */}
            {selectedImage && images.find((img) => img.id === selectedImage) && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" /> Image
                    </h3>
                    <button
                      onClick={() => setImageControlsOpen(!imageControlsOpen)}
                      className="p-1 hover:bg-accent rounded transition-all"
                    >
                      <ChevronDown
                        className="h-4 w-4 text-muted-foreground transition-transform"
                        style={{
                          transform: imageControlsOpen ? "rotate(0deg)" : "rotate(-90deg)",
                        }}
                      />
                    </button>
                  </div>

                  {/* Position & Size Controls */}
                  {imageControlsOpen && (
                    <div className="bg-background rounded-lg p-3 border border-border space-y-3">
                    <div className="grid grid-cols-2 gap-3">
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
                            updateImage(selectedImage, { width: Number(e.target.value) || 50 })
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
                            updateImage(selectedImage, { height: Number(e.target.value) || 50 })
                          }
                          className="mt-1 bg-card border-border text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Border Radius</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={images.find((img) => img.id === selectedImage)?.borderRadius || 0}
                          onChange={(e) =>
                            updateImage(selectedImage, { borderRadius: Number(e.target.value) })
                          }
                          className="flex-1 accent-primary"
                        />
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {images.find((img) => img.id === selectedImage)?.borderRadius || 0}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Border Width</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={images.find((img) => img.id === selectedImage)?.borderWidth || 0}
                          onChange={(e) =>
                            updateImage(selectedImage, { borderWidth: Number(e.target.value) })
                          }
                          className="flex-1 accent-primary"
                        />
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {images.find((img) => img.id === selectedImage)?.borderWidth || 0}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Border Color</Label>
                      <Input
                        type="color"
                        value={images.find((img) => img.id === selectedImage)?.borderColor || "#000000"}
                        onChange={(e) =>
                          updateImage(selectedImage, { borderColor: e.target.value })
                        }
                        className="mt-1 bg-card border-border text-xs h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Quick Position</Label>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-2"
                          onClick={() => updateImage(selectedImage, { x: 175, y: 20 })}
                          title="Position at top center"
                        >
                          ↑ Top
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-2"
                          onClick={() => updateImage(selectedImage, { x: 175, y: 140 })}
                          title="Position at center"
                        >
                          ⊙ Center
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-2"
                          onClick={() => updateImage(selectedImage, { x: 175, y: 260 })}
                          title="Position at bottom center"
                        >
                          ↓ Bottom
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Alignment</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-2"
                          onClick={() => updateImage(selectedImage, { x: 25 })}
                          title="Align to left"
                        >
                          Left
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-2"
                          onClick={() => updateImage(selectedImage, { x: 175 })}
                          title="Center horizontally"
                        >
                          Center
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-2"
                          onClick={() => {
                            const img = images.find((i) => i.id === selectedImage);
                            if (img) updateImage(selectedImage, { x: 825 - img.width });
                          }}
                          title="Align to right"
                        >
                          Right
                        </Button>
                      </div>
                    </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => updateImage(selectedImage, { width: 400, height: 240 })}
                        >
                          Small
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => updateImage(selectedImage, { width: 550, height: 350 })}
                        >
                          Large
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => updateImage(selectedImage, { width: 750, height: 450 })}
                        >
                          XL
                        </Button>
                      </div>
                    </div>
                  // </div>
                  )}
                </div>

                <Separator className="bg-border" />
              </>
            )}

            {/* Logo Controls */}
            {logo && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      Logo Settings
                    </h3>
                    <button
                      onClick={() => setLogoControlsOpen(!logoControlsOpen)}
                      className="p-1 hover:bg-accent rounded transition-all"
                    >
                      <ChevronDown
                        className="h-4 w-4 text-muted-foreground transition-transform"
                        style={{
                          transform: logoControlsOpen ? "rotate(0deg)" : "rotate(-90deg)",
                        }}
                      />
                    </button>
                  </div>

                  {logoControlsOpen && (
                    <div className="bg-background rounded-lg p-3 border border-border space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">X Position</Label>
                        <Input
                          type="number"
                          value={logoProps.x}
                          onChange={(e) =>
                            setLogoProps({ ...logoProps, x: Math.max(0, Number(e.target.value)) })
                          }
                          className="mt-1 bg-card border-border text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Y Position</Label>
                        <Input
                          type="number"
                          value={logoProps.y}
                          onChange={(e) =>
                            setLogoProps({ ...logoProps, y: Math.max(0, Number(e.target.value)) })
                          }
                          className="mt-1 bg-card border-border text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Width</Label>
                        <Input
                          type="number"
                          value={logoProps.width}
                          onChange={(e) =>
                            setLogoProps({ ...logoProps, width: Number(e.target.value) || 20 })
                          }
                          className="mt-1 bg-card border-border text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Height</Label>
                        <Input
                          type="number"
                          value={logoProps.height}
                          onChange={(e) =>
                            setLogoProps({ ...logoProps, height: Number(e.target.value) || 20 })
                          }
                          className="mt-1 bg-card border-border text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Border Radius</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={logoProps.borderRadius || 0}
                          onChange={(e) =>
                            setLogoProps({ ...logoProps, borderRadius: Number(e.target.value) })
                          }
                          className="flex-1 accent-primary"
                        />
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {logoProps.borderRadius || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  )}
                </div>

                <Separator className="bg-border" />
              </>
            )}

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
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Image</DialogTitle>
            <DialogDescription>Choose your preferred format and size.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Format</Label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as "png" | "jpg" | "webp")}
                className="w-full mt-2 px-3 py-2 bg-card border border-border rounded text-sm text-foreground"
              >
                <option value="png">PNG (Recommended)</option>
                <option value="jpg">JPG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium">Size</Label>
              <select
                value={exportSize}
                onChange={(e) => setExportSize(e.target.value as "800x420" | "1200x630" | "1920x1008")}
                className="w-full mt-2 px-3 py-2 bg-card border border-border rounded text-sm text-foreground"
              >
                <option value="800x420">800 × 420 (Small)</option>
                <option value="1200x630">1200 × 630 (Standard)</option>
                <option value="1920x1008">1920 × 1008 (Large)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={performExport} disabled={isExporting}>
              {isExporting ? "Downloading..." : "Download"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Editor;
