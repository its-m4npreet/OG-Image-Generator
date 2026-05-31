import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Hexagon,
  Download,
  Share2,
  ArrowLeft,
  Type,
  Palette,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Trash2,
  Layers,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CircleUserRound,
  MoreVertical,
  PanelLeft,
  PanelRight,
} from "lucide-react";
import { toPng, toJpeg } from "html-to-image";
import {
  gradientMap,
  gradients,
  gradientCSSMap,
  solidColors,
  colorHexMap,
  isLightColor,
  getNoiseDataUrl,
  isLightBackground,
  gradientUsesAlpha,
  APP_BG_DARK,
} from "@/lib/colors";
import { templates } from "@/templates";

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

type ShapeType = "rectangle" | "circle" | "line" | "arrow" | "triangle";

interface CanvasShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  rotation: number;
  opacity: number;
}

interface ContentPosition {
  x: number;
  y: number;
  width: number;
  textAlign: "left" | "center" | "right";
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
  const cleanHex = hex.replace("#", "");

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
  const templateSubtitle =
    searchParams.get("subtitle") ||
    "A compelling description that captures attention";
  const templateGradient = searchParams.get("gradient");
  const templateLogo = searchParams.get("logo");
  const templateImage = searchParams.get("image");
  const templateImagePosition = searchParams.get("imagePosition");
  const templateLogoPosition = searchParams.get("logoPosition");
  const templateContentPosition = searchParams.get("contentPosition");
  const templateTitleColor = searchParams.get("titleColor");
  const templateSubtitleColor = searchParams.get("subtitleColor");
  const templateAuthorColor = searchParams.get("authorColor");
  const templateTitleSize = searchParams.get("titleSize")
    ? Number(searchParams.get("titleSize"))
    : 40;
  const templateHasAuthor = searchParams.get("hasAuthor") !== "false"; // Default to true

  // Helper function to get initial gradient index
  const getInitialGradient = () => {
    if (!templateGradient) return 0;
    const foundIndex = gradients.findIndex((g) => g === templateGradient);
    return foundIndex !== -1 ? foundIndex : 0;
  };

  const [title, setTitle] = useState(templateTitle);
  const [subtitle, setSubtitle] = useState(templateSubtitle);
  const [author, setAuthor] = useState("Author Name");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showAuthor, setShowAuthor] = useState(templateHasAuthor);
  const [showAvatar, setShowAvatar] = useState(true);
  const [selectedGradient, setSelectedGradient] =
    useState(getInitialGradient());
  const [showAllGradients, setShowAllGradients] = useState(false);
  const [gradientsLoading, setGradientsLoading] = useState(false);
  const [selectedSolidColor, setSelectedSolidColor] = useState<string | null>(
    null,
  );
  const [showAllSolidColors, setShowAllSolidColors] = useState(false);
  const [solidColorsLoading, setSolidColorsLoading] = useState(false);
  const [backgroundType, setBackgroundType] = useState<"gradient" | "solid">(
    "gradient",
  );
  const [noiseLevel, setNoiseLevel] = useState(0); // 0-100 range
  const [noiseImageUrl, setNoiseImageUrl] = useState("");
  const [selectedFont, setSelectedFont] = useState(0);
  const [fontSize, setFontSize] = useState(templateTitleSize);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [imageControlsOpen, setImageControlsOpen] = useState(false);
  const [logoControlsOpen, setLogoControlsOpen] = useState(false);
  const [images, setImages] = useState<CanvasImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [shapes, setShapes] = useState<CanvasShape[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
  const [shapeColor, setShapeColor] = useState("#000000");
  const [selectedLogo, setSelectedLogo] = useState(false);
  const [selectedTextElement, setSelectedTextElement] = useState(false);

  const [logo, setLogo] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<"png" | "jpg" | "webp">(
    "png",
  );
  const [exportSize, setExportSize] = useState<
    "800x420" | "1200x630" | "1920x1008"
  >("1200x630");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [logoProps, setLogoProps] = useState<LogoProperties>({
    x: 16,
    y: 16,
    width: 48,
    height: 48,
    borderRadius: 0,
  });

  const [contentPosition, setContentPosition] =
    useState<ContentPosition | null>(null);
  const [lockedLayers, setLockedLayers] = useState<Set<string>>(new Set());
  const [layerOrder, setLayerOrder] = useState<string[]>(["Card", "Text", "Subtitle"]);
  const [layerDeleteConfirm, setLayerDeleteConfirm] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<"design" | "templates" | "library">(
    "design",
  );
  const [zoom, setZoom] = useState(90);
  const [selectedTool, setSelectedTool] = useState<
    "move" | "text" | "color" | ShapeType | null
  >(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Sync layerOrder with images/logo
  useEffect(() => {
    setLayerOrder(prev => {
      const next = [...prev];
      if (images.length > 0 && !next.includes("Image")) next.push("Image");
      else if (images.length === 0) return next.filter(l => l !== "Image");
      if (logo && !next.includes("Logo")) next.push("Logo");
      else if (!logo) return next.filter(l => l !== "Logo");
      return next;
    });
  }, [images.length > 0, !!logo]);

  const visibleLayers = useMemo(() => {
    const layerMap: Record<string, { name: string; icon: React.ReactNode; onClick: () => void }> = {
      Card: {
        name: "Card",
        icon: <Palette className="h-3.5 w-3.5" />,
        onClick: () => backgroundRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      },
      Text: {
        name: "Text",
        icon: <Type className="h-3.5 w-3.5" />,
        onClick: () => contentPositionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      },
      Subtitle: {
        name: "Subtitle",
        icon: <Type className="h-3.5 w-3.5" />,
        onClick: () => contentPositionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      },
      Image: {
        name: "Image",
        icon: <ImageIcon className="h-3.5 w-3.5" />,
        onClick: () => {
          if (images.length > 0) {
            setSelectedImage(images[0]?.id ?? null);
            setImageControlsOpen(true);
            setTimeout(() => imageControlsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
          }
        },
      },
      Logo: {
        name: "Logo",
        icon: <ImageIcon className="h-3.5 w-3.5" />,
        onClick: () => logoControlsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      },
    };

    return layerOrder
      .filter(name => {
        if (name === "Image") return images.length > 0;
        if (name === "Logo") return !!logo;
        return true;
      })
      .map(name => layerMap[name]);
  }, [layerOrder, images, logo]);

  const moveLayerUp = (name: string) => {
    setLayerOrder(prev => {
      const idx = prev.indexOf(name);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveLayerDown = (name: string) => {
    setLayerOrder(prev => {
      const idx = prev.indexOf(name);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (name: string) => {
    dragLayerRef.current = name;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (targetName: string) => {
    const sourceName = dragLayerRef.current;
    if (!sourceName || sourceName === targetName) {
      setDragOverIndex(null);
      return;
    }
    setLayerOrder(prev => {
      const sourceIdx = prev.indexOf(sourceName);
      const targetIdx = prev.indexOf(targetName);
      if (sourceIdx === -1 || targetIdx === -1) return prev;
      const next = [...prev];
      next.splice(sourceIdx, 1);
      next.splice(targetIdx, 0, sourceName);
      return next;
    });
    dragLayerRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragLayerRef.current = null;
    setDragOverIndex(null);
  };

  const handleLayerDelete = (name: string) => {
    if (name === "Image") {
      deleteImage(images[0]?.id);
    } else if (name === "Logo") {
      deleteLogo();
    } else if (name === "Text") {
      setTitle("");
    } else if (name === "Subtitle") {
      setShowSubtitle(false);
    }
    setLayerOrder(prev => prev.filter(l => l !== name));
    setLayerDeleteConfirm(null);
  };

  const getLayerZIndex = (layerName: string): number => {
    const idx = visibleLayers.findIndex(l => l.name === layerName);
    if (idx === -1) return 0;
    return (idx + 1) * 10;
  };

  const getDefaultTitleColor = () => {
    if (templateTitleColor) return templateTitleColor;
    return isLightBackground(
      backgroundType,
      selectedGradient,
      selectedSolidColor,
    )
      ? "#000000"
      : "#FFFFFF";
  };

  const getDefaultSubtitleColor = () => {
    if (templateSubtitleColor) return templateSubtitleColor;
    return isLightBackground(
      backgroundType,
      selectedGradient,
      selectedSolidColor,
    )
      ? "#1F2937"
      : "#E5E7EB";
  };

  const getDefaultAuthorColor = () => {
    if (templateAuthorColor) return templateAuthorColor;
    return isLightBackground(
      backgroundType,
      selectedGradient,
      selectedSolidColor,
    )
      ? "#4B5563"
      : "#9CA3AF";
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
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const imageControlsRef = useRef<HTMLDivElement>(null);
  const contentPositionRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const logoControlsRef = useRef<HTMLDivElement>(null);
  const dragLayerRef = useRef<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle keyboard zoom shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          setZoom((prev) => Math.min(prev + 10, 200));
        } else if (e.key === "-") {
          e.preventDefault();
          setZoom((prev) => Math.max(prev - 10, 50));
        } else if (e.key === "0") {
          e.preventDefault();
          setZoom(90);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTemplateSelect = (template: (typeof templates)[number]) => {
    const gradientIdx = gradients.findIndex((g) => g === template.gradient);
    if (gradientIdx !== -1) setSelectedGradient(gradientIdx);
    setTitle(template.title);
    setSubtitle(template.subtitle);
    setTitleColor(template.titleColor);
    setSubtitleColor(template.subtitleColor);
    if ("authorColor" in template && template.authorColor)
      setAuthorColor(template.authorColor);
    setFontSize(template.titleSize);
    setShowAuthor(template.hasAuthor);
    if (template.contentPosition) setContentPosition(template.contentPosition);
  };

  // Load template data from URL parameters
  useEffect(() => {
    if (templateLogo && templateLogo.trim()) {
      // Load logo from template
      fetch(templateLogo)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            setLogo(e.target?.result as string);
          };
          reader.readAsDataURL(blob);
        })
        .catch((err) => console.log("Logo load skipped:", err));
    }

    if (templateContentPosition) {
      try {
        const pos = JSON.parse(templateContentPosition);
        if (pos && pos.x !== undefined) {
          setContentPosition({
            x: pos.x,
            y: pos.y ?? 200,
            width: pos.width ?? 400,
            textAlign: pos.textAlign ?? "left",
          });
        }
      } catch (err) {
        console.log("Could not parse content position:", err);
      }
    }

    if (templateImage && templateImage.trim()) {
      // Load template image
      fetch(templateImage)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Parse position data from URL or use defaults
            let imageX = 175,
              imageY = 140,
              imageWidth = 550,
              imageHeight = 350;
            let rotation = 0,
              shadowBlur = 0,
              shadowSpread = 0,
              shadowColor = "#000000",
              shadowOpacity = 0;
            let borderRadius = 0,
              borderWidth = 0,
              borderColor = "#000000";

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
        .catch((err) => console.log("Image load skipped:", err));
    }
  }, [
    templateLogo,
    templateImage,
    templateImagePosition,
    templateContentPosition,
  ]);

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
        }),
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

  // Pre-render noise as a PNG so html-to-image captures it correctly
  useEffect(() => {
    let cancelled = false;
    const generate = async () => {
      if (noiseLevel === 0) {
        setNoiseImageUrl("");
        return;
      }
      const bgColor =
        backgroundType === "solid" && selectedSolidColor
          ? colorHexMap[selectedSolidColor]
          : undefined;
      const url = await getNoiseDataUrl(noiseLevel, bgColor);
      if (!cancelled) setNoiseImageUrl(url);
    };
    generate();
    return () => {
      cancelled = true;
    };
  }, [noiseLevel, backgroundType, selectedSolidColor]);

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
        x: 175, // Centered horizontally on canvas (900px width)
        y: 140, // Centered vertically on canvas (630px height)
        width: 550, // Default width
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
      }),
    );
  };

  const addShape = (type: ShapeType, x: number, y: number) => {
    const baseSize = type === "line" ? 180 : 100;
    const newShape: CanvasShape = {
      id: `shape-${Date.now()}-${Math.random()}`,
      type,
      x,
      y,
      width: baseSize,
      height: type === "line" ? 3 : baseSize,
      color: shapeColor,
      strokeWidth: type === "line" ? 3 : 2,
      rotation: 0,
      opacity: 100,
    };
    setShapes((prev) => [...prev, newShape]);
    setSelectedShapeId(newShape.id);
    setSelectedImage(null);
  };

  const updateShape = (id: string, updates: Partial<CanvasShape>) => {
    setShapes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
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

    // If explicit contentPosition is set and images exist, use % so it scales at any export size
    // When there are no images, always center the content
    if (contentPosition && images.length > 0) {
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
  const convertToWebP = (
    imageDataUrl: string,
    quality: number = 0.8,
  ): Promise<Blob> => {
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
          quality,
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

      await new Promise((resolve) => setTimeout(resolve, 150));

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
        const dataUrl = await toJpeg(canvasRef.current, {
          ...exportOptions,
          quality: 0.95,
        });
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
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-3 md:px-6 shrink-0">
        <div className="flex items-center gap-1 md:gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setLeftOpen(!leftOpen)}
            title="Toggle panel"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Hexagon className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline font-semibold text-foreground text-sm">
              OG Studio
            </span>
          </div>
          {/* Zoom Controls */}
          <div className="hidden md:flex items-center gap-2 ml-6 pl-4 border-l border-border/50">
            <button
              onClick={() => setZoom((prev) => Math.max(prev - 10, 50))}
              className="p-1.5 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground"
              title="Zoom out (Ctrl -)"
            >
              −
            </button>
            <span className="text-xs font-medium text-muted-foreground min-w-10 text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((prev) => Math.min(prev + 10, 200))}
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
        <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
          <span className="font-semibold text-foreground text-sm">
            Open Graph Design
          </span>
          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
            Pro
          </span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setRightOpen(!rightOpen)}
            title="Toggle settings"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
          <Button variant="hero" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> Export PNG
          </Button>
        </div>
      </header>

      {(leftOpen || rightOpen) && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => { setLeftOpen(false); setRightOpen(false); }} />
      )}

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left Panel */}
        <div className={`${
          leftOpen
            ? 'fixed inset-y-0 left-0 z-50 w-72 shadow-2xl'
            : 'hidden'
        } lg:relative lg:z-auto lg:block lg:w-72 border-r border-border bg-card shrink-0 h-full overflow-hidden`}>
          <div
            className="p-4 space-y-6 w-72 overflow-y-auto no-scrollbar h-full"
            style={
              {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              } as React.CSSProperties
            }
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            <div className="pb-4 border-b border-border/30">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground rounded text-[10px] font-bold">
                  T
                </span>
                Content
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 bg-background border-border"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs text-muted-foreground">
                    Subtitle
                  </Label>
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
                <Input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="mt-1 bg-background border-border"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs text-muted-foreground">
                    Author
                  </Label>
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
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="mt-1 bg-background border-border"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">
                    Avatar
                  </Label>
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
                  <img
                    src={logo}
                    alt="logo"
                    className="h-10 w-10 object-contain"
                  />
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
                  <span className="text-sm font-medium text-foreground">
                    Add Image
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG or WEBP (Max. 5MB)
                  </span>
                </div>
              ) : (
                <div className="bg-background rounded-lg p-3 border border-border flex items-center justify-between">
                  <img
                    src={images[0].src}
                    alt="image"
                    className="h-12 w-12 object-cover rounded"
                  />
                  <div className="flex-1 ml-3">
                    <p className="text-xs font-medium text-foreground">
                      Image uploaded
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click to replace
                    </p>
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
            {initialLoading ? (
              <Skeleton className="w-[900px] aspect-[1200/630] rounded-xl" />
            ) : (
            <div
              ref={canvasRef}
              className={`flex-shrink-0 shadow-2xl relative overflow-hidden flex items-center justify-center`}
              onClick={(e) => {
                if (e.target !== e.currentTarget) return;
                setSelectedImage(null);
                setSelectedLogo(false);
                setSelectedTextElement(false);
                setImageControlsOpen(false);
                setSelectedShapeId(null);
                if (
                  !selectedTool ||
                  selectedTool === "move" ||
                  selectedTool === "color" ||
                  selectedTool === "text"
                )
                  return;
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                const scaleX = 900 / rect.width;
                const scaleY = 630 / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;
                const baseSize = selectedTool === "line" ? 180 : 100;
                addShape(
                  selectedTool as ShapeType,
                  x - baseSize / 2,
                  y - baseSize / 2,
                );
              }}
              style={{
                width: "900px",
                aspectRatio: "1200 / 630",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center",
                transition: "transform 0.2s ease-out",
                fontFamily: fontOptions[selectedFont],
                ...(backgroundType === "gradient"
                  ? {
                      backgroundColor: gradientUsesAlpha(
                        gradientCSSMap[selectedGradient],
                      )
                        ? APP_BG_DARK
                        : "transparent",
                      backgroundImage:
                        noiseLevel > 0 && noiseImageUrl
                          ? `${gradientCSSMap[selectedGradient]}, url(${noiseImageUrl})`
                          : gradientCSSMap[selectedGradient],
                      backgroundSize:
                        noiseLevel > 0 && noiseImageUrl
                          ? "100% 100%, 200px 200px"
                          : "100% 100%",
                    }
                  : {
                      backgroundColor: selectedSolidColor
                        ? colorHexMap[selectedSolidColor] || "#ffffff"
                        : "#ffffff",
                      backgroundImage: noiseImageUrl
                        ? `url(${noiseImageUrl})`
                        : "none",
                      backgroundSize: noiseImageUrl ? "200px 200px" : "0 0",
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
                    selectedImage === img.id
                      ? " shadow-xl"
                      : "shadow-lg hover:shadow-2xl"
                  }`}
                  style={{
                    left: `${(img.x / 900) * 100}%`,
                    top: `${(img.y / 630) * 100}%`,
                    width: `${(img.width / 900) * 100}%`,
                    height: `${(img.height / 630) * 100}%`,
                    cursor: "move",
                    transform: `rotate(${img.rotation || 0}deg)`,
                    touchAction: "none",
                    zIndex: getLayerZIndex("Image"),
                    outline: selectedImage === img.id ? "3px solid #3b82f6" : "none",
                    outlineOffset: "2px",
                  }}
                  onClick={() => {
                    if (lockedLayers.has("Image")) return;
                    setSelectedImage(img.id);
                    setSelectedLogo(false);
                    setSelectedTextElement(false);
                    setImageControlsOpen(true);
                    setActiveSidebar("image");
                    setTimeout(() => imageControlsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                  }}
                  onMouseDown={(e) => {
                    if (!canvasRef.current) return;
                    if (lockedLayers.has("Image")) return;
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedImage(img.id);
                    setSelectedLogo(false);
                    setSelectedTextElement(false);

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
                      border:
                        img.borderWidth && img.borderWidth > 0
                          ? `${img.borderWidth}px solid ${img.borderColor || "#000000"}`
                          : "none",
                      boxShadow:
                        (img.shadowBlur || 0) > 0 ||
                        (img.shadowSpread || 0) > 0 ||
                        (img.shadowOpacity || 0) > 0
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
                    zIndex: getLayerZIndex("Logo"),
                    outline: selectedLogo ? "3px solid #3b82f6" : "none",
                    outlineOffset: "2px",
                  }}
                  onClick={() => {
                    setSelectedLogo(true);
                    setSelectedImage(null);
                    setLogoControlsOpen(true);
                    setImageControlsOpen(true);
                    setActiveSidebar("logo");
                    setTimeout(() => logoControlsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
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
                onClick={() => {
                  setSelectedTextElement(true);
                  setSelectedImage(null);
                  setSelectedLogo(false);
                  setImageControlsOpen(true);
                  setActiveSidebar("text");
                  setTimeout(() => contentPositionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
                }}
                style={{
                  ...getTextPositioning(),
                  zIndex: Math.max(getLayerZIndex("Text"), getLayerZIndex("Subtitle")),
                  padding: "2rem",
                  overflow: "hidden",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  outline: selectedTextElement ? "2px solid #3b82f6" : "none",
                  outlineOffset: "-2px",
                  borderRadius: selectedTextElement ? "4px" : "0px",
                }}
                className="space-y-6"
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
                    style={{
                      color: subtitleColor,
                      fontSize: `${fontSize * 0.3}px`,
                      lineHeight: 1.4,
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
                  <div
                    className="flex items-center gap-2"
                    style={{
                      justifyContent:
                        getTextPositioning().textAlign === "center"
                          ? "center"
                          : getTextPositioning().textAlign === "left"
                            ? "flex-start"
                            : "flex-end",
                      width: "100%",
                      wordWrap: "break-word",
                      overflow: "hidden",
                    }}
                  >
                    {showAvatar &&
                      (avatar ? (
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
                    <span className="text-sm" style={{ color: authorColor }}>
                      {author}
                    </span>
                  </div>
                )}
              </div>

              {/* Shapes */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 5 }}
              >
                {shapes.map((shape) => {
                  const isSelected = selectedShapeId === shape.id;
                  const halfW = shape.width / 2;
                  const halfH = shape.height / 2;
                  const cx = shape.x + halfW;
                  const cy = shape.y + halfH;
                  return (
                    <g
                      key={shape.id}
                      className="pointer-events-auto"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShapeId(shape.id);
                        setSelectedImage(null);
                        setSelectedLogo(false);
                        setSelectedTextElement(false);
                      }}
                    >
                      {shape.type === "rectangle" && (
                        <rect
                          x={shape.x}
                          y={shape.y}
                          width={shape.width}
                          height={shape.height}
                          fill={shape.color}
                          fillOpacity={shape.opacity / 100}
                          stroke={isSelected ? "#3b82f6" : shape.color}
                          strokeWidth={isSelected ? 2 : shape.strokeWidth}
                          strokeOpacity={shape.opacity / 100}
                          rx={2}
                        />
                      )}
                      {shape.type === "circle" && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={Math.min(shape.width, shape.height) / 2}
                          fill={shape.color}
                          fillOpacity={shape.opacity / 100}
                          stroke={isSelected ? "#3b82f6" : shape.color}
                          strokeWidth={isSelected ? 2 : shape.strokeWidth}
                          strokeOpacity={shape.opacity / 100}
                        />
                      )}
                      {shape.type === "line" && (
                        <line
                          x1={shape.x}
                          y1={cy}
                          x2={shape.x + shape.width}
                          y2={cy}
                          stroke={shape.color}
                          strokeOpacity={shape.opacity / 100}
                          strokeWidth={shape.strokeWidth}
                          strokeLinecap="round"
                        />
                      )}
                      {shape.type === "arrow" && (
                        <>
                          <line
                            x1={shape.x}
                            y1={cy}
                            x2={shape.x + shape.width}
                            y2={cy}
                            stroke={shape.color}
                            strokeOpacity={shape.opacity / 100}
                            strokeWidth={shape.strokeWidth}
                            strokeLinecap="round"
                          />
                          <polygon
                            points={`${shape.x + shape.width},${cy} ${shape.x + shape.width - 14},${cy - 7} ${shape.x + shape.width - 14},${cy + 7}`}
                            fill={shape.color}
                            fillOpacity={shape.opacity / 100}
                          />
                        </>
                      )}
                      {shape.type === "triangle" && (
                        <polygon
                          points={`${cx},${shape.y} ${shape.x + shape.width},${shape.y + shape.height} ${shape.x},${shape.y + shape.height}`}
                          fill={shape.color}
                          fillOpacity={shape.opacity / 100}
                          stroke={isSelected ? "#3b82f6" : shape.color}
                          strokeWidth={isSelected ? 2 : shape.strokeWidth}
                          strokeOpacity={shape.opacity / 100}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className={`${
          rightOpen
            ? 'fixed inset-y-0 right-0 z-50 w-80 shadow-2xl'
            : 'hidden'
        } lg:relative lg:z-auto lg:block lg:w-80 border-l border-border bg-card shrink-0 h-full flex flex-col overflow-y-auto`}>
          {/* Tabs */}
          {/* <div className="flex border-b border-border bg-background/30">
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
          </div> */}

          {/* Tab Content */}
          <div ref={rightPanelRef} className="flex-1 p-4 space-y-6 w-80 overflow-y-auto">
            {/* DESIGN Tab */}
            {rightTab === "design" && (
              <div>
                {/* Style / Colors - At Top */}
                <div ref={backgroundRef}>
                  {/* Background Type Toggle */}
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Background
                  </Label>
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
                      <Label className="text-xs text-muted-foreground mb-2 block">
                        Gradient Colors
                      </Label>
                      <div className="grid grid-cols-7 gap-1">
                        {initialLoading
                          ? Array.from({ length: 14 }).map((_, i) => (
                              <Skeleton key={i} className="aspect-square rounded-md" />
                            ))
                          : gradients.slice(0, 13).map((g, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedGradient(i)}
                                className={`aspect-square rounded-md border transition-all duration-150 ${
                                  selectedGradient === i
                                    ? "border-primary ring-2 ring-primary"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                                style={{ background: gradientCSSMap[i] }}
                                title={`Gradient ${i + 1}`}
                              />
                            ))}
                        {showAllGradients && !initialLoading && (
                          gradientsLoading
                            ? Array.from({ length: gradients.length - 13 }).map((_, i) => (
                                <Skeleton key={`grad-sk-${i}`} className="aspect-square rounded-md" />
                              ))
                            : gradients.slice(13).map((g, i) => (
                                <button
                                  key={`gradient-${i + 13}`}
                                  onClick={() => setSelectedGradient(i + 13)}
                                  className={`aspect-square rounded-md border transition-all duration-150 ${
                                    selectedGradient === i + 13
                                      ? "border-primary ring-2 ring-primary"
                                      : "border-border hover:border-muted-foreground"
                                  }`}
                                  style={{ background: gradientCSSMap[i + 13] }}
                                  title={`Gradient ${i + 14}`}
                                />
                              ))
                        )}
                        {!initialLoading && gradients.length > 13 && (
                          <button
                            onClick={() => {
                              if (!showAllGradients) {
                                setShowAllGradients(true);
                                setGradientsLoading(true);
                                setTimeout(() => setGradientsLoading(false), 500);
                              } else {
                                setShowAllGradients(false);
                              }
                            }}
                            className="aspect-square rounded-md border border-border hover:border-muted-foreground transition-all duration-150 flex items-center justify-center bg-background"
                            title={showAllGradients ? "Show less" : "Show all gradients"}
                          >
                            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${showAllGradients ? "rotate-180" : ""}`} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Solid Colors */}
                  {backgroundType === "solid" && (
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">
                        Solid Colors
                      </Label>
                      <div className="grid grid-cols-7 gap-1.5">
                        {initialLoading
                          ? Array.from({ length: 14 }).map((_, i) => (
                              <Skeleton key={i} className="aspect-square rounded-md" />
                            ))
                          : solidColors.slice(0, 13).map((color, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedSolidColor(color)}
                            className={`aspect-square rounded-md ${color} border-2 transition-all duration-150 ${
                              selectedSolidColor === color
                                ? "border-white ring-2 ring-white"
                                : "border-border hover:border-gray-400"
                            }`}
                            title={color}
                          />
                        ))}
                        {showAllSolidColors && !initialLoading && (
                          solidColorsLoading
                            ? Array.from({ length: solidColors.length - 13 }).map((_, i) => (
                                <Skeleton key={`solid-sk-${i}`} className="aspect-square rounded-md" />
                              ))
                            : solidColors.slice(13).map((color, i) => (
                                <button
                                  key={`solid-${i + 13}`}
                                  onClick={() => setSelectedSolidColor(color)}
                                  className={`aspect-square rounded-md ${color} border-2 transition-all duration-150 ${
                                    selectedSolidColor === color
                                      ? "border-white ring-2 ring-white"
                                      : "border-border hover:border-gray-400"
                                  }`}
                                  title={color}
                                />
                              ))
                        )}
                        {!initialLoading && solidColors.length > 13 && (
                          <button
                            onClick={() => {
                              if (!showAllSolidColors) {
                                setShowAllSolidColors(true);
                                setSolidColorsLoading(true);
                                setTimeout(() => setSolidColorsLoading(false), 500);
                              } else {
                                setShowAllSolidColors(false);
                              }
                            }}
                            className="aspect-square rounded-md border-2 border-border hover:border-gray-400 transition-all duration-150 flex items-center justify-center bg-transparent"
                            title={showAllSolidColors ? "Show less" : "Show all colors"}
                          >
                            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${showAllSolidColors ? "rotate-180" : ""}`} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <Separator className="bg-border my-3" />

                  {/* Noise Section */}
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      Noise Overlay
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={noiseLevel}
                        onChange={(e) =>
                          setNoiseLevel(
                            Math.max(
                              0,
                              Math.min(100, Number(e.target.value) || 0),
                            ),
                          )
                        }
                        className="flex-1 [&]:h-auto [&]:border-0 [&]:px-0 [&]:py-0"
                      />
                      <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">
                        {noiseLevel}%
                      </span>
                    </div>
                  </div>

                  <Separator className="bg-border my-3" />

                  {/* Layers */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                      <Layers className="h-4 w-4" /> Layers
                    </h3>
                    <div className="space-y-1">
                      {visibleLayers.map((layer, i) => {
                        const locked = lockedLayers.has(layer.name);
                        const isFirst = i === 0;
                        const isLast = i === visibleLayers.length - 1;
                        return (
                          <div
                            key={layer.name}
                            draggable
                            onDragStart={() => handleDragStart(layer.name)}
                            onDragOver={(e) => handleDragOver(e, i)}
                            onDragLeave={handleDragLeave}
                            onDrop={() => handleDrop(layer.name)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center gap-1 group cursor-grab active:cursor-grabbing rounded transition-colors ${
                              dragOverIndex === i ? "bg-accent/50" : ""
                            }`}
                          >
                            <button
                              onClick={layer.onClick}
                              className="flex-1 flex items-center gap-2 px-2 py-2 text-xs rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                            >
                              {layer.icon}
                              {layer.name}
                            </button>
                            <button
                              onClick={() => {
                                const next = new Set(lockedLayers);
                                if (locked) next.delete(layer.name);
                                else next.add(layer.name);
                                setLockedLayers(next);
                              }}
                              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                            >
                              {locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-all ">
                                  <MoreVertical className="h-3 w-3" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="min-w-[130px]">
                                <DropdownMenuItem disabled={isFirst} onClick={() => moveLayerUp(layer.name)}>
                                  <ChevronUp className="h-3.5 w-3.5 mr-2" /> Move Up
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={isLast} onClick={() => moveLayerDown(layer.name)}>
                                  <ChevronDown className="h-3.5 w-3.5 mr-2" /> Move Down
                                </DropdownMenuItem>
                                {layer.name !== "Card" && (
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setLayerDeleteConfirm(layer.name)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text Colors */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                      <Type className="h-4 w-4" /> Text Colors
                    </h3>
                    <div className="space-y-2">
                      <ColorRow
                        label="Title Color"
                        value={titleColor}
                        onChange={setTitleColor}
                      />
                      <ColorRow
                        label="Subtitle Color"
                        value={subtitleColor}
                        onChange={setSubtitleColor}
                      />
                      <ColorRow
                        label="Author Color"
                        value={authorColor}
                        onChange={setAuthorColor}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-border" />

                {/* Image Controls */}
                {selectedImage &&
                  images.find((img) => img.id === selectedImage) && (
                    <>
                      <div ref={imageControlsRef}>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" /> Image
                          </h3>
                          <button
                            onClick={() =>
                              setImageControlsOpen(!imageControlsOpen)
                            }
                            className="p-1 hover:bg-accent rounded transition-all"
                          >
                            <ChevronDown
                              className="h-4 w-4 text-muted-foreground transition-transform"
                              style={{
                                transform: imageControlsOpen
                                  ? "rotate(0deg)"
                                  : "rotate(-90deg)",
                              }}
                            />
                          </button>
                        </div>

                        {/* Position & Size Controls */}
                        {imageControlsOpen && (
                          <div className="bg-background rounded-lg p-3 border border-border space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  X Position (-∞ to 700)
                                </Label>
                                <Input
                                  type="number"
                                  max="700"
                                  step="1"
                                  value={Math.round(
                                    images.find(
                                      (img) => img.id === selectedImage,
                                    )?.x || 0,
                                  )}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    const clamped = Math.min(
                                      700,
                                      isNaN(val) ? 0 : val,
                                    );
                                    updateImage(selectedImage, { x: clamped });
                                  }}
                                  className="mt-1 bg-card border-border text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Y Position (-∞ to 300)
                                </Label>
                                <Input
                                  type="number"
                                  max="300"
                                  step="1"
                                  value={Math.round(
                                    images.find(
                                      (img) => img.id === selectedImage,
                                    )?.y || 0,
                                  )}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    const clamped = Math.min(
                                      300,
                                      isNaN(val) ? 0 : val,
                                    );
                                    updateImage(selectedImage, { y: clamped });
                                  }}
                                  className="mt-1 bg-card border-border text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Width
                                </Label>
                                <Input
                                  type="number"
                                  value={Math.round(
                                    images.find(
                                      (img) => img.id === selectedImage,
                                    )?.width || 0,
                                  )}
                                  onChange={(e) =>
                                    updateImage(selectedImage, {
                                      width: Number(e.target.value) || 50,
                                    })
                                  }
                                  className="mt-1 bg-card border-border text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Height
                                </Label>
                                <Input
                                  type="number"
                                  value={Math.round(
                                    images.find(
                                      (img) => img.id === selectedImage,
                                    )?.height || 0,
                                  )}
                                  onChange={(e) =>
                                    updateImage(selectedImage, {
                                      height: Number(e.target.value) || 50,
                                    })
                                  }
                                  className="mt-1 bg-card border-border text-xs"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Border Radius
                                </Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="50"
                                  value={
                                    images.find(
                                      (img) => img.id === selectedImage,
                                    )?.borderRadius || 0
                                  }
                                  onChange={(e) =>
                                    updateImage(selectedImage, {
                                      borderRadius: Math.max(
                                        0,
                                        Math.min(
                                          50,
                                          Number(e.target.value) || 0,
                                        ),
                                      ),
                                    })
                                  }
                                  className="mt-1 bg-card border-border text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Border Width
                                </Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  value={
                                    images.find(
                                      (img) => img.id === selectedImage,
                                    )?.borderWidth || 0
                                  }
                                  onChange={(e) =>
                                    updateImage(selectedImage, {
                                      borderWidth: Math.max(
                                        0,
                                        Math.min(
                                          10,
                                          Number(e.target.value) || 0,
                                        ),
                                      ),
                                    })
                                  }
                                  className="mt-1 bg-card border-border text-xs"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground mb-2 block">
                                Border Color
                              </Label>
                              <Input
                                type="color"
                                value={
                                  images.find((img) => img.id === selectedImage)
                                    ?.borderColor || "#000000"
                                }
                                onChange={(e) =>
                                  updateImage(selectedImage, {
                                    borderColor: e.target.value,
                                  })
                                }
                                className="mt-1 bg-card border-border text-xs"
                              />
                            </div>

                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Rotation
                              </Label>
                              <Input
                                type="number"
                                value={
                                  images.find((img) => img.id === selectedImage)
                                    ?.rotation || 0
                                }
                                onChange={(e) =>
                                  updateImage(selectedImage, {
                                    rotation: Number(e.target.value) || 0,
                                  })
                                }
                                className="mt-1 bg-card border-border text-xs"
                                placeholder="0"
                              />
                            </div>

                            <div>
                              <Label className="text-xs text-muted-foreground mb-2 block">
                                Box Shadow
                              </Label>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Blur
                                  </Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={
                                      images.find(
                                        (img) => img.id === selectedImage,
                                      )?.shadowBlur || 0
                                    }
                                    onChange={(e) =>
                                      updateImage(selectedImage, {
                                        shadowBlur: Math.max(
                                          0,
                                          Math.min(
                                            50,
                                            Number(e.target.value) || 0,
                                          ),
                                        ),
                                      })
                                    }
                                    className="mt-1 bg-card border-border text-xs"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Spread
                                  </Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={
                                      images.find(
                                        (img) => img.id === selectedImage,
                                      )?.shadowSpread || 0
                                    }
                                    onChange={(e) =>
                                      updateImage(selectedImage, {
                                        shadowSpread: Math.max(
                                          0,
                                          Math.min(
                                            50,
                                            Number(e.target.value) || 0,
                                          ),
                                        ),
                                      })
                                    }
                                    className="mt-1 bg-card border-border text-xs"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Color
                                  </Label>
                                  <Input
                                    type="color"
                                    value={
                                      images.find(
                                        (img) => img.id === selectedImage,
                                      )?.shadowColor || "#000000"
                                    }
                                    onChange={(e) =>
                                      updateImage(selectedImage, {
                                        shadowColor: e.target.value,
                                      })
                                    }
                                    className="mt-1 bg-card border-border text-xs "
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Opacity
                                  </Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={
                                      images.find(
                                        (img) => img.id === selectedImage,
                                      )?.shadowOpacity || 0
                                    }
                                    onChange={(e) =>
                                      updateImage(selectedImage, {
                                        shadowOpacity: Math.max(
                                          0,
                                          Math.min(
                                            100,
                                            Number(e.target.value) || 0,
                                          ),
                                        ),
                                      })
                                    }
                                    className="mt-1 bg-card border-border text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    <Separator className="bg-border" />
                    </>
                  )}
                {logo && (
                  <div ref={logoControlsRef}>
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
                              transform: logoControlsOpen
                                ? "rotate(0deg)"
                                : "rotate(-90deg)",
                            }}
                          />
                        </button>
                      </div>

                      {logoControlsOpen && (
                        <div className="bg-background rounded-lg p-3 border border-border space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                X Position
                              </Label>
                              <Input
                                type="number"
                                value={logoProps.x}
                                onChange={(e) =>
                                  setLogoProps({
                                    ...logoProps,
                                    x: Math.max(0, Number(e.target.value)),
                                  })
                                }
                                className="mt-1 bg-card border-border text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Y Position
                              </Label>
                              <Input
                                type="number"
                                value={logoProps.y}
                                onChange={(e) =>
                                  setLogoProps({
                                    ...logoProps,
                                    y: Math.max(0, Number(e.target.value)),
                                  })
                                }
                                className="mt-1 bg-card border-border text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Width
                              </Label>
                              <Input
                                type="number"
                                value={logoProps.width}
                                onChange={(e) =>
                                  setLogoProps({
                                    ...logoProps,
                                    width: Number(e.target.value) || 20,
                                  })
                                }
                                className="mt-1 bg-card border-border text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Height
                              </Label>
                              <Input
                                type="number"
                                value={logoProps.height}
                                onChange={(e) =>
                                  setLogoProps({
                                    ...logoProps,
                                    height: Number(e.target.value) || 20,
                                  })
                                }
                                className="mt-1 bg-card border-border text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Border Radius
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              max="50"
                              value={logoProps.borderRadius || 0}
                              onChange={(e) =>
                                setLogoProps({
                                  ...logoProps,
                                  borderRadius: Math.max(
                                    0,
                                    Math.min(50, Number(e.target.value) || 0),
                                  ),
                                })
                              }
                              className="mt-1 bg-card border-border text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-border" />
                  </div>
                )}

                {/* Content Position Controls */}
                <div
                  ref={contentPositionRef}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Type className="h-4 w-4" /> Content Position
                    </h3>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          X Position
                        </Label>
                        <Input
                          type="number"
                          value={contentPosition?.x ?? 0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setContentPosition((prev) =>
                              prev
                                ? { ...prev, x: isNaN(val) ? 0 : val }
                                : {
                                    x: isNaN(val) ? 0 : val,
                                    y: 200,
                                    width: 400,
                                    textAlign: "center",
                                  },
                            );
                          }}
                          className="mt-1 bg-card border-border text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Y Position
                        </Label>
                        <Input
                          type="number"
                          value={contentPosition?.y ?? 0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setContentPosition((prev) =>
                              prev
                                ? { ...prev, y: isNaN(val) ? 0 : val }
                                : {
                                    x: 50,
                                    y: isNaN(val) ? 0 : val,
                                    width: 400,
                                    textAlign: "center",
                                  },
                            );
                          }}
                          className="mt-1 bg-card border-border text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Max Width
                        </Label>
                        <Input
                          type="number"
                          value={contentPosition?.width ?? 400}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setContentPosition((prev) =>
                              prev
                                ? { ...prev, width: isNaN(val) ? 400 : val }
                                : {
                                    x: 50,
                                    y: 200,
                                    width: isNaN(val) ? 400 : val,
                                    textAlign: "center",
                                  },
                            );
                          }}
                          className="mt-1 bg-card border-border text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shape Properties */}
                {selectedShapeId &&
                  (() => {
                    const shape = shapes.find((s) => s.id === selectedShapeId);
                    if (!shape) return null;
                    return (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <Hexagon className="h-4 w-4" />{" "}
                              {shape.type.charAt(0).toUpperCase() +
                                shape.type.slice(1)}
                            </h3>
                            <button
                              onClick={() => {
                                setShapes((prev) =>
                                  prev.filter((s) => s.id !== selectedShapeId),
                                );
                                setSelectedShapeId(null);
                              }}
                              className="p-1 hover:bg-destructive/20 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                          <div className="bg-background rounded-lg p-3 border border-border space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  X
                                </Label>
                                <Input
                                  type="number"
                                  value={Math.round(shape.x)}
                                  onChange={(e) =>
                                    updateShape(shape.id, {
                                      x: Number(e.target.value) || 0,
                                    })
                                  }
                                  className="mt-1 bg-card border-border text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Y
                                </Label>
                                <Input
                                  type="number"
                                  value={Math.round(shape.y)}
                                  onChange={(e) =>
                                    updateShape(shape.id, {
                                      y: Number(e.target.value) || 0,
                                    })
                                  }
                                  className="mt-1 bg-card border-border text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Width
                                </Label>
                                <Input
                                  type="number"
                                  value={Math.round(shape.width)}
                                  onChange={(e) =>
                                    updateShape(shape.id, {
                                      width: Math.max(
                                        10,
                                        Number(e.target.value) || 10,
                                      ),
                                    })
                                  }
                                  className="mt-1 bg-card border-border text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Height
                                </Label>
                                <Input
                                  type="number"
                                  value={Math.round(shape.height)}
                                  onChange={(e) =>
                                    updateShape(shape.id, {
                                      height: Math.max(
                                        10,
                                        Number(e.target.value) || 10,
                                      ),
                                    })
                                  }
                                  className="mt-1 bg-card border-border text-xs"
                                />
                              </div>
                            </div>
                            <ColorRow
                              label="Color"
                              value={shape.color}
                              onChange={(color) =>
                                updateShape(shape.id, { color })
                              }
                            />
                            {shape.type !== "line" && (
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Border Width
                                </Label>
                                <Input
                                  type="number"
                                  min={0}
                                  max={20}
                                  value={shape.strokeWidth}
                                  onChange={(e) =>
                                    updateShape(shape.id, {
                                      strokeWidth: Math.max(
                                        0,
                                        Number(e.target.value) || 0,
                                      ),
                                    })
                                  }
                                  className="mt-1 bg-card border-border text-xs"
                                />
                              </div>
                            )}
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Opacity
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={shape.opacity}
                                onChange={(e) =>
                                  updateShape(shape.id, {
                                    opacity: Math.max(
                                      0,
                                      Math.min(
                                        100,
                                        Number(e.target.value) || 0,
                                      ),
                                    ),
                                  })
                                }
                                className="mt-1 bg-card border-border text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                <Separator className="bg-border" />

                {/* Font */}
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Font Family
                  </Label>
                  <Select
                    value={fontOptions[selectedFont]}
                    onValueChange={(val) =>
                      setSelectedFont(fontOptions.indexOf(val))
                    }
                  >
                    <SelectTrigger className="mt-2 bg-card border-border text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {fontOptions.map((f) => (
                        <SelectItem key={f} value={f} className="text-xs">
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-border" />

                {/* Font Size */}
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Title Size
                  </Label>
                  <Input
                    type="number"
                    min="24"
                    max="64"
                    value={fontSize}
                    onChange={(e) =>
                      setFontSize(
                        Math.max(
                          24,
                          Math.min(64, Number(e.target.value) || 24),
                        ),
                      )
                    }
                    className="mt-1 bg-card border-border text-xs"
                  />
                </div>

                <Separator className="bg-border" />
              </div>
            )}

            {/* TEMPLATES Tab */}
            {rightTab === "templates" && (
              <div className="space-y-3">
                {initialLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="w-full aspect-[1200/630] rounded-lg" />
                    ))
                  : templates.map((template) => {
                  return (
                    <button
                      key={template.id}
                      onClick={() => {
                        handleTemplateSelect(template);
                        setRightTab("design");
                      }}
                      className={`group w-full aspect-[1200/630] rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-200 text-left relative bg-card bg-gradient-to-br ${template.preview.bg}`}
                    >
                      <div className="absolute inset-0 transition-all duration-200 group-hover:scale-[1.05]">
                      {template.hasImage && template.imagePosition && (
                        <div
                          className="absolute bg-white/10 rounded border border-white/10"
                          style={{
                            left: `${(template.imagePosition.x / 900) * 100}%`,
                            top: `${(template.imagePosition.y / 630) * 100}%`,
                            width: `${(template.imagePosition.width / 900) * 100}%`,
                            height: `${(template.imagePosition.height / 630) * 100}%`,
                            transform: template.imagePosition.rotation
                              ? `rotate(${template.imagePosition.rotation}deg)`
                              : undefined,
                          }}
                        />
                      )}
                      {template.contentPosition && template.hasImage ? (
                        <>
                          <div
                            className="absolute leading-tight font-bold"
                            style={{
                              left: `${(template.contentPosition.x / 900) * 100}%`,
                              top: `${(template.contentPosition.y / 630) * 100}%`,
                              width: `${(template.contentPosition.width / 900) * 100}%`,
                              textAlign:
                                template.contentPosition.textAlign ?? "left",
                              color: template.titleColor,
                              fontSize: `${Math.min(template.titleSize / 5.6, 10)}px`,
                              lineHeight: "1.1",
                            }}
                          >
                            {template.title.length > 25
                              ? template.title.slice(0, 25) + "…"
                              : template.title}
                          </div>
                          <div
                            className="absolute leading-tight opacity-80"
                            style={{
                              left: `${(template.contentPosition.x / 900) * 100}%`,
                              top: `${((template.contentPosition.y + 40) / 630) * 100}%`,
                              width: `${(template.contentPosition.width / 900) * 100}%`,
                              textAlign:
                                template.contentPosition.textAlign ?? "left",
                              color: template.subtitleColor,
                              fontSize: `${Math.min(template.titleSize / 7.5, 6)}px`,
                              lineHeight: "1.1",
                            }}
                          >
                            {template.subtitle.length > 30
                              ? template.subtitle.slice(0, 30) + "…"
                              : template.subtitle}
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center">
                          <div
                            className="leading-tight font-bold w-full"
                            style={{
                              color: template.titleColor,
                              fontSize: `${Math.min(template.titleSize / 5.6, 10)}px`,
                              lineHeight: "1.1",
                            }}
                          >
                            {template.title.length > 25
                              ? template.title.slice(0, 25) + "…"
                              : template.title}
                          </div>
                          <div
                            className="leading-tight opacity-80 w-full"
                            style={{
                              color: template.subtitleColor,
                              fontSize: `${Math.min(template.titleSize / 7.5, 6)}px`,
                              lineHeight: "1.1",
                            }}
                          >
                            {template.subtitle.length > 30
                              ? template.subtitle.slice(0, 30) + "…"
                              : template.subtitle}
                          </div>
                        </div>
                      )}
                      </div>
                    </button>
                  );
                })}
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

      {/* Delete Layer Confirmation Dialog */}
      <Dialog open={!!layerDeleteConfirm} onOpenChange={() => setLayerDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Layer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{layerDeleteConfirm}" layer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLayerDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => layerDeleteConfirm && handleLayerDelete(layerDeleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Image</DialogTitle>
            <DialogDescription>
              Choose your preferred format and size.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Format</Label>
              <select
                value={exportFormat}
                onChange={(e) =>
                  setExportFormat(e.target.value as "png" | "jpg" | "webp")
                }
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
                onChange={(e) =>
                  setExportSize(
                    e.target.value as "800x420" | "1200x630" | "1920x1008",
                  )
                }
                className="w-full mt-2 px-3 py-2 bg-card border border-border rounded text-sm text-foreground"
              >
                <option value="800x420">800 × 420 (Small)</option>
                <option value="1200x630">1200 × 630 (Standard)</option>
                <option value="1920x1008">1920 × 1008 (Large)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={performExport}
              disabled={isExporting}
            >
              {isExporting ? "Downloading..." : "Download"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Editor;
