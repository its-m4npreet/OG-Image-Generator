import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ColorRow } from "@/components/ColorPicker";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Hexagon, Download, Share2, ArrowLeft, Type, Palette,
  ChevronLeft, ChevronRight, ChevronDown, Wand2, Link2, Image as ImageIcon, Trash2,
  Eye, EyeOff, CircleUserRound, Move,
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
  rotation?: number; // 0-360 for rotation
  shadowBlur?: number; // 0-50 for shadow blur
  shadowSpread?: number; // 0-50 for shadow spread
  shadowColor?: string; // shadow color hex
  shadowOpacity?: number; // 0-100 for shadow opacity
}

interface ContentPosition {
  x: number;
  y: number;
  width: number;
  textAlign: 'left' | 'center' | 'right';
}

interface LogoProperties {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
}

const fontOptions = ["Inter", "Georgia", "Arial"];

// Helper function to convert hex color to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  // Remove '#' if present
  const cleanHex = hex.replace('#', '');
  
  // Parse hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  // Convert opacity from 0-100 to 0-1
  const alpha = opacity / 100;
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
  const templateContentPosition = searchParams.get("contentPosition");
  const templateTitleColor = searchParams.get("titleColor");
  const templateSubtitleColor = searchParams.get("subtitleColor");
  const templateAuthorColor = searchParams.get("authorColor");
  const templateTitleSize = searchParams.get("titleSize") ? Number(searchParams.get("titleSize")) : 40;
  const templateHasAuthor = searchParams.get("hasAuthor") !== "false"; // Default to true
  
  // Helper function to get initial gradient index
  const getInitialGradient = () => {
    if (!templateGradient) return 0;
    const foundIndex = gradients.findIndex(g => g === templateGradient);
    return foundIndex !== -1 ? foundIndex : 0;
  };
  
  const [title, setTitle] = useState(templateTitle);
  const [subtitle, setSubtitle] = useState(templateSubtitle);
  const [author, setAuthor] = useState("Author Name");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showAuthor, setShowAuthor] = useState(templateHasAuthor);
  const [showAvatar, setShowAvatar] = useState(true);
  const [selectedGradient, setSelectedGradient] = useState(getInitialGradient());
  const [selectedSolidColor, setSelectedSolidColor] = useState<string | null>(null);
  const [backgroundType, setBackgroundType] = useState<"gradient" | "solid">("gradient");
  const [noiseLevel, setNoiseLevel] = useState(0); // 0-100 range
  const [selectedFont, setSelectedFont] = useState(0);
  const [fontSize, setFontSize] = useState(templateTitleSize);
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

  const [contentPosition, setContentPosition] = useState<ContentPosition | null>(null);
  const [rightTab, setRightTab] = useState<"design" | "templates" | "library">("design");
  const [zoom, setZoom] = useState(90);
  const [selectedTool, setSelectedTool] = useState<"move" | "text" | "draw" | "color" | null>(null);

  const getDefaultTitleColor = () => {
    if (templateTitleColor) return templateTitleColor;
    return isLightBackground(backgroundType, selectedGradient, selectedSolidColor) ? "#000000" : "#FFFFFF";
  };

  const getDefaultSubtitleColor = () => {
    if (templateSubtitleColor) return templateSubtitleColor;
    return isLightBackground(backgroundType, selectedGradient, selectedSolidColor) ? "#1F2937" : "#E5E7EB";
  };

  const getDefaultAuthorColor = () => {
    if (templateAuthorColor) return templateAuthorColor;
    return isLightBackground(backgroundType, selectedGradient, selectedSolidColor) ? "#4B5563" : "#9CA3AF";
  };

  const [titleColor, setTitleColor] = useState(getDefaultTitleColor());
  const [subtitleColor, setSubtitleColor] = useState(getDefaultSubtitleColor());
  const [authorColor, setAuthorColor] = useState(getDefaultAuthorColor());

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle keyboard zoom shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          setZoom(prev => Math.min(prev + 10, 200));
        } else if (e.key === "-") {
          e.preventDefault();
          setZoom(prev => Math.max(prev - 10, 50));
        } else if (e.key === "0") {
          e.preventDefault();
          setZoom(90);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    
    if (templateContentPosition) {
      try {
        const pos = JSON.parse(templateContentPosition);
        if (pos && pos.x !== undefined) {
          setContentPosition({
            x: pos.x,
            y: pos.y ?? 200,
            width: pos.width ?? 400,
            textAlign: pos.textAlign ?? 'left',
          });
        }
      } catch (err) {
        console.log("Could not parse content position:", err);
      }
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
            let rotation = 0, shadowBlur = 0, shadowSpread = 0, shadowColor = "#000000", shadowOpacity = 0;
            let borderRadius = 0, borderWidth = 0, borderColor = "#000000";
            
            if (templateImagePosition) {
              try {
                const pos = JSON.parse(templateImagePosition);
                imageX = pos.x ?? imageX;
                imageY = pos.y ?? imageY;
                imageWidth = pos.width ?? imageWidth;
                imageHeight = pos.height ?? imageHeight;
                rotation = pos.rotation ?? rotation;
                shadowBlur = pos.shadowBlur ?? shadowBlur;
                shadowSpread = pos.shadowSpread ?? shadowSpread;
                shadowColor = pos.shadowColor ?? shadowColor;
                shadowOpacity = pos.shadowOpacity ?? shadowOpacity;
                borderRadius = pos.borderRadius ?? borderRadius;
                borderWidth = pos.borderWidth ?? borderWidth;
                borderColor = pos.borderColor ?? borderColor;
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
              rotation,
              shadowBlur,
              shadowSpread,
              shadowColor,
              shadowOpacity,
              borderRadius,
              borderWidth,
              borderColor,
            };
            setImages([newImage]);
            setSelectedImage(newImage.id);
          };
          reader.readAsDataURL(blob);
        })
        .catch(err => console.log("Image load skipped:", err));
    }
  }, [templateLogo, templateImage, templateImagePosition, templateContentPosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = 900 / rect.width;
      const scaleY = 630 / rect.height;

      const mouseBaseX = (e.clientX - rect.left) * scaleX;
      const mouseBaseY = (e.clientY - rect.top) * scaleY;

      const newX = mouseBaseX - dragRef.current.offsetX;
      const newY = mouseBaseY - dragRef.current.offsetY;

      setImages((prev) =>
        prev.map((img) => {
          if (img.id !== dragRef.current?.id) return img;
          return {
            ...img,
            x: Math.min(Math.max(-500, newX), 700),
            y: Math.min(Math.max(-500, newY), 300),
          };
        })
      );
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        rotation: 0,
        shadowBlur: 0,
        shadowSpread: 0,
        shadowColor: "#000000",
        shadowOpacity: 0,
      };
      // Replace the image instead of adding multiple
      setImages([newImage]);
      setSelectedImage(newImage.id);
    };
    reader.readAsDataURL(file);

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
        
        // Boundary constraints - X: negative to 700, Y: negative to 300
        updated.x = Math.min(updated.x, 700);
        updated.y = Math.min(updated.y, 300);
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

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setAvatar(src);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const deleteAvatar = () => {
    setAvatar(null);
  };

  const deleteLogo = () => {
    setLogo(null);
  };

  const deleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedImage(null);
  };

  // Calculate optimal text position to avoid image overlap
  const getTextPositioning = (scaleX: number = 1, scaleY: number = 1) => {
  // Base canvas dimensions
  const BASE_W = 900;
  const BASE_H = 630;

  // If explicit contentPosition is set, use % so it scales at any export size
  if (contentPosition) {
    return {
      position: "absolute" as const,
      top: `${(contentPosition.y / BASE_H) * 100}%`,
      left: `${(contentPosition.x / BASE_W) * 100}%`,
      maxWidth: `${(contentPosition.width / BASE_W) * 100}%`,
      textAlign: contentPosition.textAlign,
    };
  }

  const textMarginX = (30 / BASE_W) * 100;
  const textMarginY = (30 / BASE_H) * 100;

  if (images.length === 0) {
    return {
      position: "absolute" as const,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "80%",
    };
  }

  const image = images[0];
  const imageBottom = image.y + image.height;
  const imageRight = image.x + image.width;

  // Image at bottom — text at top
  if (image.y >= 200) {
    return {
      position: "absolute" as const,
      top: `${textMarginY}%`,
      left: "50%",
      transform: "translateX(-50%)",
      maxWidth: "85%",
      textAlign: "center" as const,
    };
  }

  // Image on right — text on left
  if (image.x > 450) {
    return {
      position: "absolute" as const,
      top: "50%",
      left: `${textMarginX}%`,
      transform: "translateY(-50%)",
      maxWidth: `${(380 / BASE_W) * 100}%`,
      textAlign: "left" as const,
    };
  }

  // Image on left — text on right
  if (image.x < 300) {
    const rightEdge = BASE_W - (imageRight + 30);
    return {
      position: "absolute" as const,
      top: "50%",
      right: `${textMarginX}%`,
      transform: "translateY(-50%)",
      maxWidth: `${(rightEdge / BASE_W) * 100}%`,
      textAlign: "right" as const,
    };
  }

  // Image in center-top — text at bottom
  if (imageBottom < 350) {
    return {
      position: "absolute" as const,
      bottom: `${textMarginY}%`,
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

  const handleShare = async () => {
  const shareParams = new URLSearchParams({
    title,
    subtitle,
    gradient: gradients[selectedGradient] || "",
    hasAuthor: showAuthor.toString(),
  });

  const shareUrl = `${window.location.origin}${window.location.pathname}?${shareParams.toString()}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: "OG Image Design", url: shareUrl });
    } catch (error) {
      // User dismissed the share sheet — silently ignore
      if ((error as Error).name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
    return;
  }

  // Fallback: desktop browsers don't support navigator.share
  try {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  } catch {
    toast.error("Failed to copy link. Please try again.");
  }
};

  const performExport = async () => {
  if (!canvasRef.current) return;

  setIsExporting(true);
  try {
    if (document.fonts) {
      await document.fonts.ready;
    }

    await new Promise(resolve => setTimeout(resolve, 150));

    const [width, height] = exportSize.split("x").map(Number);

    // Get the actual rendered size of the preview canvas
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    const exportOptions = {
      width,
      height,
      // Scale the canvas up to export dimensions instead of cloning + manual rescaling
      style: {
        transform: `scale(${scaleX}, ${scaleY})`,
        transformOrigin: "top left",
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      },
      pixelRatio: 1,
      cacheBust: true,
    };

    let blob: Blob;

    if (exportFormat === "png") {
      const dataUrl = await toPng(canvasRef.current, exportOptions);
      blob = await (await fetch(dataUrl)).blob();
    } else if (exportFormat === "jpg") {
      const dataUrl = await toJpeg(canvasRef.current, { ...exportOptions, quality: 0.95 });
      blob = await (await fetch(dataUrl)).blob();
    } else {
      const pngDataUrl = await toPng(canvasRef.current, exportOptions);
      blob = await convertToWebP(pngDataUrl, 0.8);
    }

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
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex items-center gap-2">
            <Hexagon className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground text-sm">OG Studio</span>
          </div>
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 ml-6 pl-4 border-l border-border/50">
            <button
              onClick={() => setZoom(prev => Math.max(prev - 10, 50))}
              className="p-1.5 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground"
              title="Zoom out (Ctrl -)"
            >
              −
            </button>
            <span className="text-xs font-medium text-muted-foreground min-w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(prev + 10, 200))}
              className="p-1.5 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground"
              title="Zoom in (Ctrl +)"
            >
              +
            </button>
            <button
              onClick={() => setZoom(90)}
              className="px-2 py-1 text-xs hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground"
              title="Reset zoom (Ctrl 0)"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="font-semibold text-foreground text-sm">Open Graph Design</span>
          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">Pro</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button> 
          <Button variant="hero" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> Export PNG
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left Panel */}
        <div className="border-r border-border bg-card shrink-0 w-72 h-full overflow-hidden">
          <div 
            className="p-4 space-y-6 w-72 overflow-y-auto no-scrollbar h-full"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } as React.CSSProperties}
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            <div className="pb-4 border-b border-border/30">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground rounded text-[10px] font-bold">T</span>
                Content
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 bg-background border-border" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs text-muted-foreground">Subtitle</Label>
                  <button
                    onClick={() => setShowSubtitle(!showSubtitle)}
                    className={`p-1 rounded transition-all ${
                      showSubtitle
                        ? "bg-primary/20 text-primary hover:bg-primary/30"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    title={showSubtitle ? "Hide subtitle" : "Show subtitle"}
                  >
                    {showSubtitle ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="mt-1 bg-background border-border" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs text-muted-foreground">Author</Label>
                  <button
                    onClick={() => setShowAuthor(!showAuthor)}
                    className={`p-1 rounded transition-all ${
                      showAuthor
                        ? "bg-primary/20 text-primary hover:bg-primary/30"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    title={showAuthor ? "Hide author" : "Show author"}
                  >
                    {showAuthor ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 bg-background border-border" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">Avatar</Label>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowAvatar(!showAvatar)}
                      className={`p-1 rounded transition-all ${
                        showAvatar
                          ? "bg-primary/20 text-primary hover:bg-primary/30"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      title={showAvatar ? "Hide avatar" : "Show avatar"}
                    >
                      {showAvatar ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    {avatar && (
                      <button
                        onClick={deleteAvatar}
                        className="p-1 rounded transition-all bg-destructive/20 text-destructive hover:bg-destructive/30"
                        title="Delete avatar"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                {avatar ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => avatarInputRef.current?.click()}
                      className="text-xs"
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => avatarInputRef.current?.click()}
                    className="w-full text-xs"
                  >
                    Upload Avatar
                  </Button>
                )}
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
                <ImageIcon className="h-4 w-4" /> Image
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {images.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border bg-background/50 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Add Image</span>
                  <span className="text-xs text-muted-foreground">PNG, JPG or WEBP (Max. 5MB)</span>
                </div>
              ) : (
                <div className="bg-background rounded-lg p-3 border border-border flex items-center justify-between">
                  <img src={images[0].src} alt="image" className="h-12 w-12 object-cover rounded" />
                  <div className="flex-1 ml-3">
                    <p className="text-xs font-medium text-foreground">Image uploaded</p>
                    <p className="text-xs text-muted-foreground">Click to replace</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteImage(images[0].id);
                    }}
                    className="p-1 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              )}
              
              {images.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs mt-3"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Image
                </Button>
              )}
            </div>
          </div>
        </div>



        {/* Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center dot-grid overflow-hidden h-full min-w-0 relative">
          {/* Canvas Wrapper with Zoom */}
          <div className="flex-1 flex items-center justify-center overflow-auto w-full p-8">
            <div
              ref={canvasRef}
              className={`flex-shrink-0 shadow-2xl relative overflow-hidden flex items-center justify-center`}
              style={{
                width: "900px",
                aspectRatio: "1200 / 630",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center",
                transition: "transform 0.2s ease-out",
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
                className={`absolute ${isDragging ? "" : "transition-all duration-200"} ${
                  selectedImage === img.id ? " shadow-xl" : "shadow-lg hover:shadow-2xl"
                }`}
                style={{
                  left: `${(img.x / 900) * 100}%`,
                  top: `${(img.y / 630) * 100}%`,
                  width: `${(img.width / 900) * 100}%`,
                  height: `${(img.height / 630) * 100}%`,
                  cursor: selectedTool === "move" ? "move" : "auto",
                  transform: `rotate(${img.rotation || 0}deg)`,
                  touchAction: "none",
                }}
                onClick={() => setSelectedImage(img.id)}
                onMouseDown={(e) => {
                  if (!canvasRef.current || selectedTool !== "move") return;
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedImage(img.id);

                  const rect = canvasRef.current.getBoundingClientRect();
                  const scaleX = 900 / rect.width;
                  const scaleY = 630 / rect.height;

                  const mouseBaseX = (e.clientX - rect.left) * scaleX;
                  const mouseBaseY = (e.clientY - rect.top) * scaleY;

                  dragRef.current = {
                    id: img.id,
                    offsetX: mouseBaseX - img.x,
                    offsetY: mouseBaseY - img.y,
                  };
                  setIsDragging(true);
                }}
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
                    boxShadow: ((img.shadowBlur || 0) > 0 || (img.shadowSpread || 0) > 0 || (img.shadowOpacity || 0) > 0)
                      ? `0 0 ${img.shadowBlur || 0}px ${img.shadowSpread || 0}px ${hexToRgba(img.shadowColor || "#000000", img.shadowOpacity || 0)}`
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
                overflow: "hidden",
                wordWrap: "break-word",
                whiteSpace: "normal",
              }}
              className="space-y-4"
            >
              <h2
                className="font-bold leading-tight"
                style={{ 
                  fontSize: `${fontSize * 0.6}px`, 
                  color: titleColor,
                  wordWrap: "break-word",
                  overflow: "hidden",
                  whiteSpace: "normal",
                  width: "100%",
                }}
              >
                {title}
              </h2>
              {showSubtitle && (
                <p
                  className="text-sm md:text-base mx-auto"
                  style={{ 
                    color: subtitleColor,
                    wordWrap: "break-word",
                    overflow: "hidden",
                    whiteSpace: "normal",
                    width: "100%",
                  }}
                >
                  {subtitle}
                </p>
              )}
              {showAuthor && (
                <div className="flex items-center gap-2" style={{
                  justifyContent: getTextPositioning().textAlign === "center" ? "center" : getTextPositioning().textAlign === "left" ? "flex-start" : "flex-end",
                  width: "100%",
                  wordWrap: "break-word",
                  overflow: "hidden",
                }}>
                  {showAvatar && (avatar ? (
                    <img
                      src={avatar}
                      alt="author avatar"
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <CircleUserRound
                      size={24}
                      strokeWidth={1}
                      style={{ color: authorColor, flexShrink: 0 }}
                    />
                  ))}
                  <span
                    className="text-sm"
                    style={{ color: authorColor }}
                  >
                    {author}
                  </span>
                </div>
              )}
            </div>
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 py-3 px-8 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative group">
              <button 
                onClick={() => setSelectedTool(selectedTool === "move" ? null : "move")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  selectedTool === "move"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                } active:bg-primary/30`}
                title="Move Tool"
              >
                <Move className="w-5 h-5" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-foreground text-background text-xs rounded px-2 py-1 whitespace-nowrap">Move Tool</div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
              </div>
            </div>
            
            <div className="w-px h-6 bg-border" />
            
            <div className="relative group">
              <button 
                onClick={() => setSelectedTool(selectedTool === "text" ? null : "text")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  selectedTool === "text"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                } active:bg-primary/30`}
                title="Text Tool"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.125C3 12.504 3.504 12 4.125 12h15.75c.621 0 1.125.504 1.125 1.125v6.75C21 20.496 20.496 21 19.875 21H4.125A1.125 1.125 0 013 19.875v-6.75z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7.5h18M5 5.25h2m2 0h2m2 0h2m2 0h2" />
                </svg>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-foreground text-background text-xs rounded px-2 py-1 whitespace-nowrap">Text Tool</div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
              </div>
            </div>
            
            <div className="relative group">
              <button 
                onClick={() => setSelectedTool(selectedTool === "draw" ? null : "draw")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  selectedTool === "draw"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                } active:bg-primary/30`}
                title="Draw Tool"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-foreground text-background text-xs rounded px-2 py-1 whitespace-nowrap">Draw Tool</div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
              </div>
            </div>

            <div className="relative group">
              <button 
                onClick={() => setSelectedTool(selectedTool === "color" ? null : "color")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  selectedTool === "color"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                } active:bg-primary/30`}
                title="Color Picker"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth={2} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5m0 0v5" />
                </svg>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-foreground text-background text-xs rounded px-2 py-1 whitespace-nowrap">Color Picker</div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
              </div>
            </div>
          </div>

        </div>



        {/* Right Panel */}
        <div className="border-l border-border bg-card shrink-0 w-80 h-full flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border bg-background/30">
            <button
              onClick={() => setRightTab("design")}
              className={`flex-1 py-3 px-4 text-xs font-medium border-b-2 transition-all ${
                rightTab === "design"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              DESIGN
            </button>
            <button
              onClick={() => setRightTab("templates")}
              className={`flex-1 py-3 px-4 text-xs font-medium border-b-2 transition-all ${
                rightTab === "templates"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              TEMPLATES
            </button>
            <button
              onClick={() => setRightTab("library")}
              className={`flex-1 py-3 px-4 text-xs font-medium border-b-2 transition-all ${
                rightTab === "library"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              LIBRARY
            </button>
          </div>

          {/* Tab Content */}
          <div 
            className="flex-1 p-4 space-y-6 w-80 overflow-y-auto"
          >

            {/* DESIGN Tab */}
            {rightTab === "design" && (
            <div>
              {/* Style / Colors - At Top */}
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Palette className="h-4 w-4" /> Background
                </h3>

              {/* Background Type Toggle */}
              <Label className="text-xs text-muted-foreground mb-2 block">Background</Label>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setBackgroundType("gradient")}
                  className={`flex-1 py-1.5 px-2 text-xs rounded-sm border transition-all duration-150 ${
                    backgroundType === "gradient"
                      ? "border-primary bg-primary/10 text-foreground font-medium"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  Gradient
                </button>
                <button
                  onClick={() => setBackgroundType("solid")}
                  className={`flex-1 py-1.5 px-2 text-xs rounded-sm border transition-all duration-150 ${
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

              <Separator className="bg-border my-3" />

              {/* Text Colors */}
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Type className="h-4 w-4" /> Text Colors
                </h3>
                <div className="space-y-2">
                  <ColorRow label="Title Color" value={titleColor} onChange={setTitleColor} />
                  <ColorRow label="Subtitle Color" value={subtitleColor} onChange={setSubtitleColor} />
                  <ColorRow label="Author Color" value={authorColor} onChange={setAuthorColor} />
                </div>
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
                        <Label className="text-xs text-muted-foreground">X Position (-∞ to 700)</Label>
                        <Input
                          type="number"
                          max="700"
                          step="1"
                          value={Math.round(images.find((img) => img.id === selectedImage)?.x || 0)}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const clamped = Math.min(700, isNaN(val) ? 0 : val);
                            updateImage(selectedImage, { x: clamped });
                          }}
                          className="mt-1 bg-card border-border text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Y Position (-∞ to 300)</Label>
                        <Input
                          type="number"
                          max="300"
                          step="1"
                          value={Math.round(images.find((img) => img.id === selectedImage)?.y || 0)}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const clamped = Math.min(300, isNaN(val) ? 0 : val);
                            updateImage(selectedImage, { y: clamped });
                          }}
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
                      <Label className="text-xs text-muted-foreground mb-2 block">Rotation</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <input
                          type="range"
                          min="-360"
                          max="360"
                          value={images.find((img) => img.id === selectedImage)?.rotation || 0}
                          onChange={(e) =>
                            updateImage(selectedImage, { rotation: Number(e.target.value) })
                          }
                          className="flex-1 accent-primary"
                        />
                        <span className="text-xs text-muted-foreground w-10 text-right">
                          {images.find((img) => img.id === selectedImage)?.rotation || 0}°
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Box Shadow</Label>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Blur</Label>
                          <div className="flex items-center gap-3 mt-1">
                            <input
                              type="range"
                              min="0"
                              max="50"
                              value={images.find((img) => img.id === selectedImage)?.shadowBlur || 0}
                              onChange={(e) =>
                                updateImage(selectedImage, { shadowBlur: Number(e.target.value) })
                              }
                              className="flex-1 accent-primary"
                            />
                            <span className="text-xs text-muted-foreground w-8 text-right">
                              {images.find((img) => img.id === selectedImage)?.shadowBlur || 0}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Spread</Label>
                          <div className="flex items-center gap-3 mt-1">
                            <input
                              type="range"
                              min="0"
                              max="50"
                              value={images.find((img) => img.id === selectedImage)?.shadowSpread || 0}
                              onChange={(e) =>
                                updateImage(selectedImage, { shadowSpread: Number(e.target.value) })
                              }
                              className="flex-1 accent-primary"
                            />
                            <span className="text-xs text-muted-foreground w-8 text-right">
                              {images.find((img) => img.id === selectedImage)?.shadowSpread || 0}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Color</Label>
                          <Input
                            type="color"
                            value={images.find((img) => img.id === selectedImage)?.shadowColor || "#000000"}
                            onChange={(e) =>
                              updateImage(selectedImage, { shadowColor: e.target.value })
                            }
                            className="mt-1 bg-card border-border text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Opacity</Label>
                          <div className="flex items-center gap-3 mt-1">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={images.find((img) => img.id === selectedImage)?.shadowOpacity || 0}
                              onChange={(e) =>
                                updateImage(selectedImage, { shadowOpacity: Number(e.target.value) })
                              }
                              className="flex-1 accent-primary"
                            />
                            <span className="text-xs text-muted-foreground w-8 text-right">
                              {images.find((img) => img.id === selectedImage)?.shadowOpacity || 0}%
                            </span>
                          </div>
                        </div>
                      </div>
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

            {/* Content Position Controls */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Type className="h-4 w-4" /> Content Position
                </h3>
              </div>
              <div className="bg-background rounded-lg p-3 border border-border space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">X Position</Label>
                    <Input
                      type="number"
                      value={contentPosition?.x ?? 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setContentPosition(prev => prev ? { ...prev, x: isNaN(val) ? 0 : val } : { x: isNaN(val) ? 0 : val, y: 200, width: 400, textAlign: 'center' });
                      }}
                      className="mt-1 bg-card border-border text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Y Position</Label>
                    <Input
                      type="number"
                      value={contentPosition?.y ?? 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setContentPosition(prev => prev ? { ...prev, y: isNaN(val) ? 0 : val } : { x: 50, y: isNaN(val) ? 0 : val, width: 400, textAlign: 'center' });
                      }}
                      className="mt-1 bg-card border-border text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Max Width</Label>
                    <Input
                      type="number"
                      value={contentPosition?.width ?? 400}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setContentPosition(prev => prev ? { ...prev, width: isNaN(val) ? 400 : val } : { x: 50, y: 200, width: isNaN(val) ? 400 : val, textAlign: 'center' });
                      }}
                      className="mt-1 bg-card border-border text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Text Alignment</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <Button
                        key={align}
                        variant="outline"
                        size="sm"
                        className={`text-xs h-8 ${contentPosition?.textAlign === align ? 'border-primary bg-primary/10 text-foreground' : ''}`}
                        onClick={() => setContentPosition(prev => prev ? { ...prev, textAlign: align } : { x: 50, y: 200, width: 400, textAlign: align })}
                      >
                        {align.charAt(0).toUpperCase() + align.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
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
          </div>
            )}

            {/* TEMPLATES Tab */}
            {rightTab === "templates" && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Templates coming soon...</p>
              </div>
            )}

            {/* LIBRARY Tab */}
            {rightTab === "library" && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Library coming soon...</p>
              </div>
            )}
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
