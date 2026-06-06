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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
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
  Move,
  MousePointer2,
  Frame,
  Settings2,
} from "lucide-react";
import { toPng, toJpeg } from "html-to-image";
import {
  gradientMap,
  gradients,
  gradientCSSMap,
  solidColors,
  colorHexMap,
  patternMap,
  APP_BG_DARK,
  gradientUsesAlpha,
  isLightBackground,
  isLightColor,
  getNoiseDataUrl,
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

interface CanvasTag {
  id: string;
  text: string;
  x: number;
  y: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
}

interface CanvasLogo {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
}

interface ContentPosition {
  x: number;
  y: number;
  width: number;
  textAlign: "left" | "center" | "right";
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
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [],
  );

  // Extract parameters at component level
  const templateTitle = searchParams.get("title") || "Your Amazing Blog Title";
  const templateSubtitle = searchParams.get("subtitle") ?? "A compelling description that captures attention";
  const templateGradient = searchParams.get("gradient");
  const templateLogo = searchParams.get("logo");
  const templateImage = searchParams.get("image");
  const templateImagePosition = searchParams.get("imagePosition");
  const templateLogoPosition = searchParams.get("logoPosition");
  const templateLogoPositions = useMemo(() => {
    const param = searchParams.get("logoPositions");
    if (!param) return null;
    try {
      return JSON.parse(param) as { x: number; y: number; width: number; height: number; borderRadius?: number }[];
    } catch {
      return null;
    }
  }, [searchParams]);
  const templateLogoUrls = useMemo<string[]>(() => {
    const param = searchParams.get("logoUrls");
    return param
      ? (() => {
          try {
            return JSON.parse(param);
          } catch {
            return [];
          }
        })()
      : [];
  }, [searchParams]);
  const templateContentPosition = searchParams.get("contentPosition");
  const templateTitleColor = searchParams.get("titleColor");
  const templateSubtitleColor = searchParams.get("subtitleColor");
  const templateAuthorColor = searchParams.get("authorColor");
  const templateTitleSize = searchParams.get("titleSize")
    ? Number(searchParams.get("titleSize"))
    : 40;
  const templateHasAuthor = searchParams.get("hasAuthor") !== "false"; // Default to true
  const templateBackgroundType = searchParams.get("backgroundType") as
    | "gradient"
    | "solid"
    | "pattern"
    | null;
  const templatePattern = searchParams.get("pattern")
    ? Number(searchParams.get("pattern"))
    : null;

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
  const [showSubtitle, setShowSubtitle] = useState(templateSubtitle !== "");
  const [showAuthor, setShowAuthor] = useState(templateHasAuthor);
  const [showAvatar, setShowAvatar] = useState(true);
  const [selectedGradient, setSelectedGradient] =
    useState(getInitialGradient());
  const [customGradientFrom, setCustomGradientFrom] = useState("#6366f1");
  const [customGradientTo, setCustomGradientTo] = useState("#a78bfa");
  const [useCustomGradient, setUseCustomGradient] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [showAllGradients, setShowAllGradients] = useState(false);
  const [gradientsLoading, setGradientsLoading] = useState(false);
  const [selectedSolidColor, setSelectedSolidColor] = useState<string | null>(
    "bg-cyan-700",
  );
  const [showAllSolidColors, setShowAllSolidColors] = useState(false);
  const [solidColorsLoading, setSolidColorsLoading] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<number | null>(
    templateBackgroundType === "pattern" && templatePattern !== null
      ? templatePattern
      : 0,
  );
  const [backgroundType, setBackgroundType] = useState<
    "gradient" | "solid" | "pattern"
  >(templateBackgroundType || "gradient");
  const [noiseLevel, setNoiseLevel] = useState(0); // 0-100 range
  const [noiseImageUrl, setNoiseImageUrl] = useState("");
  const [selectedFont, setSelectedFont] = useState(0);
  const [fontSize, setFontSize] = useState(templateTitleSize);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [imageControlsOpen, setImageControlsOpen] = useState(false);
  const [logoControlsOpen, setLogoControlsOpen] = useState(false);
  const [authorGroupOpen, setAuthorGroupOpen] = useState(true);
  const [images, setImages] = useState<CanvasImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [shapes, setShapes] = useState<CanvasShape[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
  const [shapeColor, setShapeColor] = useState("#000000");
  const [selectedTextElement, setSelectedTextElement] = useState(false);
  const [tags, setTags] = useState<CanvasTag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [templateTag, setTemplateTag] = useState(searchParams.get("tag") || "");
  const [templateIsTag, setTemplateIsTag] = useState(
    searchParams.get("istag") === "true",
  );
  const [templateTagPosition, setTemplateTagPosition] = useState<Pick<
    CanvasTag,
    "x" | "y" | "borderWidth" | "borderColor" | "borderRadius"
  > | null>(() => {
    const tp = searchParams.get("tagPosition");
    if (tp) {
      try {
        return JSON.parse(tp);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [logos, setLogos] = useState<CanvasLogo[]>([]);
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);
  const [isMultipleLogo, setIsMultipleLogo] = useState(false);

  const [exportFormat, setExportFormat] = useState<"png" | "jpg" | "webp">(
    "png",
  );

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [contentPosition, setContentPosition] =
    useState<ContentPosition | null>(null);
  const [lockedLayers, setLockedLayers] = useState<Set<string>>(new Set());
  const [layerOrder, setLayerOrder] = useState<string[]>([
    "Card",
    "Text",
    "Subtitle",
    "Author",
    "Avatar",
    "Tag",
  ]);
  const [layerDeleteConfirm, setLayerDeleteConfirm] = useState<string | null>(
    null,
  );
  const [rightTab, setRightTab] = useState<"design" | "templates" | "library">(
    "design",
  );
  const [zoom, setZoom] = useState(90);
  const [selectedTool, setSelectedTool] = useState<"move" | "select" | null>(
    "select",
  );
  const [blurred, setBlurred] = useState(false);
  const [frameGridVisible, setFrameGridVisible] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const activeLogo = useMemo(() => {
    if (isMultipleLogo && selectedLogoId)
      return logos.find((l) => l.id === selectedLogoId) || null;
    if (!isMultipleLogo && logos.length > 0) return logos[0];
    return null;
  }, [logos, selectedLogoId, isMultipleLogo]);

  const updateLogo = (id: string, updates: Partial<CanvasLogo>) => {
    setLogos((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Sync layerOrder with images/logo/tags
  useEffect(() => {
    setLayerOrder((prev) => {
      let next = [...prev];
      if (images.length === 0) next = next.filter((l) => l !== "Image");
      if (logos.length === 0) next = next.filter((l) => l !== "Logo");
      if (tags.length === 0) next = next.filter((l) => l !== "Tag");
      if (images.length > 0 && !next.includes("Image")) next.push("Image");
      if (logos.length > 0 && !next.includes("Logo")) next.push("Logo");
      if (tags.length > 0 && !next.includes("Tag")) next.push("Tag");
      return next;
    });
  }, [images.length, logos.length, tags.length]);

  const visibleLayers = useMemo(() => {
    const layerMap: Record<
      string,
      { name: string; icon: React.ReactNode; onClick: () => void }
    > = {
      Card: {
        name: "Card",
        icon: <Palette className="h-3.5 w-3.5" />,
        onClick: () =>
          backgroundRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
      },
      Text: {
        name: "Text",
        icon: <Type className="h-3.5 w-3.5" />,
        onClick: () =>
          contentPositionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
      },
      Subtitle: {
        name: "Subtitle",
        icon: <Type className="h-3.5 w-3.5" />,
        onClick: () =>
          contentPositionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
      },
      Author: {
        name: "Author",
        icon: <Type className="h-3.5 w-3.5" />,
        onClick: () =>
          contentPositionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
      },
      Avatar: {
        name: "Avatar",
        icon: <ImageIcon className="h-3.5 w-3.5" />,
        onClick: () =>
          contentPositionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
      },
      Image: {
        name: "Image",
        icon: <ImageIcon className="h-3.5 w-3.5" />,
        onClick: () => {
          if (images.length > 0) {
            setSelectedImage(images[0]?.id ?? null);
            setImageControlsOpen(true);
            setTimeout(
              () =>
                imageControlsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                }),
              50,
            );
          }
        },
      },
      Logo: {
        name: "Logo",
        icon: <ImageIcon className="h-3.5 w-3.5" />,
        onClick: () =>
          logoControlsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
      },
      Tag: {
        name: "Tag",
        icon: <Hexagon className="h-3.5 w-3.5" />,
        onClick: () =>
          tagControlsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
      },
    };

    return layerOrder
      .filter((name) => {
        if (name === "Image") return images.length > 0;
        if (name === "Logo") return logos.length > 0;
        if (name === "Tag") return tags.length > 0;
        return true;
      })
      .map((name) => layerMap[name]);
  }, [layerOrder, images, logos, tags]);

  const moveLayerUp = (name: string) => {
    setLayerOrder((prev) => {
      const idx = prev.indexOf(name);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveLayerDown = (name: string) => {
    setLayerOrder((prev) => {
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
    setLayerOrder((prev) => {
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
    } else if (name === "Tag") {
      setTags([]);
      setSelectedTagId(null);
      setTemplateIsTag(false);
      setTemplateTag("");
      setTemplateTagPosition(null);
    }
    setLayerOrder((prev) => prev.filter((l) => l !== name));
    setLayerDeleteConfirm(null);
  };

  const getLayerZIndex = (layerName: string): number => {
    const idx = visibleLayers.findIndex((l) => l.name === layerName);
    if (idx === -1) return 0;
    return (idx + 1) * 10;
  };

  const getIsLightBackground = () => {
    if (useCustomGradient) {
      return isLightColor(customGradientFrom) || isLightColor(customGradientTo);
    }
    return isLightBackground(
      backgroundType,
      selectedGradient,
      selectedSolidColor,
      selectedPattern,
    );
  };

  const getDefaultTitleColor = () => {
    if (templateTitleColor) return templateTitleColor;
    if (
      backgroundType === "pattern" &&
      selectedPattern !== null &&
      isLightBackground(
        backgroundType,
        selectedGradient,
        selectedSolidColor,
        selectedPattern,
      )
    )
      return "#292929";
    return getIsLightBackground() ? "#000000" : "#FFFFFF";
  };

  const getDefaultSubtitleColor = () => {
    if (templateSubtitleColor) return templateSubtitleColor;
    if (
      backgroundType === "pattern" &&
      selectedPattern !== null &&
      isLightBackground(
        backgroundType,
        selectedGradient,
        selectedSolidColor,
        selectedPattern,
      )
    )
      return "#545454";
    return getIsLightBackground() ? "#1F2937" : "#E5E7EB";
  };

  const getDefaultAuthorColor = () => {
    if (templateAuthorColor) return templateAuthorColor;
    if (
      backgroundType === "pattern" &&
      selectedPattern !== null &&
      isLightBackground(
        backgroundType,
        selectedGradient,
        selectedSolidColor,
        selectedPattern,
      )
    )
      return "#383838";
    return getIsLightBackground() ? "#4B5563" : "#9CA3AF";
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
  const contentDragRef = useRef<{
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const logoDragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const tagDragRef = useRef<{
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
  const tagControlsRef = useRef<HTMLDivElement>(null);
  const logoReplaceRef = useRef<string | null>(null);
  const templateColorRef = useRef(false);
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
    if ("pattern" in template && template.pattern !== undefined) {
      setSelectedPattern(template.pattern);
      setBackgroundType("pattern");
      const p = patternMap[template.pattern];
      if (p) {
        const hex = p.backgroundColor?.replace("#", "") || "ffffff";
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const isLight = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
        if (isLight) {
          setTitleColor("#292929");
          setSubtitleColor("#545454");
          setAuthorColor("#383838");
        } else {
          setTitleColor("#FFFFFF");
          setSubtitleColor("#E5E7EB");
          setAuthorColor("#9CA3AF");
        }
      }
      setNoiseLevel(0);
    } else {
      const gradientIdx = gradients.findIndex((g) => g === template.gradient);
      if (gradientIdx !== -1) setSelectedGradient(gradientIdx);
      setBackgroundType("gradient");
    }
    setTitle(template.title);
    setSubtitle(template.subtitle);
    setShowSubtitle(template.subtitle !== "");
    templateColorRef.current = true;
    setTitleColor(template.titleColor);
    setSubtitleColor(template.subtitleColor);
    if ("authorColor" in template && template.authorColor)
      setAuthorColor(template.authorColor);
    setFontSize(template.titleSize);
    setShowAuthor(template.hasAuthor);
    if (template.contentPosition) setContentPosition(template.contentPosition);
    if ("ismultiple" in template) setIsMultipleLogo(!!template.ismultiple);
    else setIsMultipleLogo(false);
    setImages([]);
    setSelectedImage(null);
    setLogos([]);
    setSelectedLogoId(null);
    setTemplateTag(template.tag ?? "");
    setTemplateIsTag(template.istag ?? false);
    setBlurred("blurred" in template ? !!template.blurred : false);
    // AFTER
    const tp =
      "tagPosition" in template && template.tagPosition
        ? { ...template.tagPosition } // spread to strip readonly
        : null;
    setTemplateTagPosition(tp);
    if (template.istag && template.tag) {
      const pos = tp ?? {
        x: 20,
        y: 20,
        borderWidth: 1,
        borderColor: "#3b82f6",
        borderRadius: 10,
      };
      setTags([
        {
          id: `tag-${Date.now()}-${Math.random()}`,
          text: template.tag,
          x: pos.x,
          y: pos.y,
          borderWidth: pos.borderWidth,
          borderColor: pos.borderColor,
          borderRadius: pos.borderRadius,
        },
      ]);
      setSelectedTagId(null);
    } else {
      setTags([]);
      setSelectedTagId(null);
    }

    if (
      "logoUrls" in template &&
      template.logoUrls &&
      Array.isArray(template.logoUrls)
    ) {
      const urls = template.logoUrls.filter(Boolean);
      if (urls.length > 0) {
        Promise.all(
          urls.map((url, i) =>
            fetch(url)
              .then((res) => res.blob())
              .then(
                (blob) =>
                  new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(blob);
                  }),
              )
              .catch((err) => {
                console.log("Logo load skipped:", err);
                return null;
              }),
          ),
        ).then((results) => {
          const srcs = results.filter(Boolean) as string[];
          const rawPositions: { x: number; y: number; width: number; height: number; borderRadius?: number }[] | null =
            "logoPositions" in template && template.logoPositions
              ? (template.logoPositions as unknown as { x: number; y: number; width: number; height: number; borderRadius?: number }[])
              : null;
          const pos: { x: number; y: number; width: number; height: number } = "logoPosition" in template && template.logoPosition
            ? template.logoPosition as { x: number; y: number; width: number; height: number }
            : { x: 16, y: 16, width: 48, height: 48 };
          const newLogos: CanvasLogo[] = srcs.map((src, i) => {
            const p: { x: number; y: number; width: number; height: number; borderRadius?: number } | undefined = rawPositions?.[i];
            return {
              id: `logo-${Date.now()}-${i}`,
              src,
              x: p ? p.x : pos.x + i * 20,
              y: p ? p.y : pos.y + i * 20,
              width: p ? p.width : pos.width,
              height: p ? p.height : pos.height,
              borderRadius: p ? (p.borderRadius ?? 0) : 0,
            };
          });
          setLogos(newLogos);
          if (newLogos.length > 0) setSelectedLogoId(newLogos[0].id);
        });
      }
    }
  };

  // Load template data from URL parameters
  useEffect(() => {
    let cancelled = false;
    if (templateLogoUrls.length > 0) {
      setIsMultipleLogo(true);
      setLogos([]);
      const urls = templateLogoUrls.filter(Boolean);
      if (urls.length > 0) {
        Promise.all(
          urls.map((url, i) =>
            fetch(url)
              .then((res) => res.blob())
              .then(
                (blob) =>
                  new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(blob);
                  }),
              )
              .catch((err) => {
                console.log("Logo load skipped:", err);
                return null;
              }),
          ),
        ).then((results) => {
          if (cancelled) return;
          const srcs = results.filter(Boolean) as string[];
          let pos: {
            x?: number;
            y?: number;
            width?: number;
            height?: number;
            borderRadius?: number;
          } | null = null;
          if (templateLogoPosition) {
            try {
              pos = JSON.parse(templateLogoPosition);
            } catch {
              /* ignore */
            }
          }
          const baseX = pos?.x ?? 16;
          const baseY = pos?.y ?? 16;
          const newLogos: CanvasLogo[] = srcs.map((src, i) => ({
            id: `logo-${Date.now()}-${i}`,
            src,
            x: templateLogoPositions?.[i]?.x ?? baseX + i * 20,
            y: templateLogoPositions?.[i]?.y ?? baseY + i * 20,
            width: templateLogoPositions?.[i]?.width ?? pos?.width ?? 48,
            height: templateLogoPositions?.[i]?.height ?? pos?.height ?? 48,
            borderRadius: templateLogoPositions?.[i]?.borderRadius ?? pos?.borderRadius ?? 0,
          }));
          setLogos(newLogos);
          if (newLogos.length > 0) setSelectedLogoId(newLogos[0].id);
        });
      }
    } else if (templateLogo && templateLogo.trim()) {
      fetch(templateLogo)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const id = `logo-${Date.now()}`;
            const newLogo: CanvasLogo = {
              id,
              src: e.target?.result as string,
              x: 16,
              y: 16,
              width: 48,
              height: 48,
              borderRadius: 0,
            };
            if (cancelled) return;
            if (templateLogoPosition) {
              try {
                const pos = JSON.parse(templateLogoPosition);
                newLogo.x = pos.x ?? newLogo.x;
                newLogo.y = pos.y ?? newLogo.y;
                newLogo.width = pos.width ?? newLogo.width;
                newLogo.height = pos.height ?? newLogo.height;
                newLogo.borderRadius = pos.borderRadius ?? newLogo.borderRadius;
              } catch (err) {
                console.log("Could not parse logo position:", err);
              }
            }
            if (cancelled) return;
            setLogos([newLogo]);
            setSelectedLogoId(id);
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

    // AFTER
if (searchParams.get("istag") === "true") {
  const tagText = searchParams.get("tag");
  if (tagText) {
    const tp = searchParams.get("tagPosition");
     let pos: { x: number; y: number; borderWidth: number; borderColor: string; borderRadius: number } = { x: 45, y: 26, borderWidth: 1, borderColor: "#3b82f6", borderRadius: 10 };
    if (tp) { try { pos = JSON.parse(tp); } catch { /* ignore */ } }
        setTags([
          {
            id: `tag-${Date.now()}-${Math.random()}`,
            text: tagText,
            x: pos.x,
            y: pos.y,
            borderWidth: pos.borderWidth,
            borderColor: pos.borderColor,
            borderRadius: pos.borderRadius,
          },
        ]);
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
              shadowBlur = 10,
              shadowSpread = 2,
              shadowColor = "#7c3aed",
              shadowOpacity = 30;
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
          };
          reader.readAsDataURL(blob);
        })
        .catch((err) => console.log("Image load skipped:", err));
    }
    return () => {
      cancelled = true;
    };
  }, [
    templateLogo,
    templateImage,
    templateImagePosition,
    templateContentPosition,
    templateLogoPosition,
    templateLogoPositions,
    templateLogoUrls,
    searchParams,
  ]);

  // Update text colors when switching to pattern backgrounds
  useEffect(() => {
    if (backgroundType !== "pattern" || selectedPattern === null) return;
    if (templateColorRef.current) {
      templateColorRef.current = false;
      return;
    }
    const p = patternMap[selectedPattern];
    if (!p) return;
    const hex = p.backgroundColor?.replace("#", "") || "ffffff";
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const isLight = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
    if (isLight) {
      setTitleColor("#292929");
      setSubtitleColor("#545454");
      setAuthorColor("#383838");
    } else {
      setTitleColor("#FFFFFF");
      setSubtitleColor("#E5E7EB");
      setAuthorColor("#9CA3AF");
    }
    setNoiseLevel(0);
  }, [backgroundType, selectedPattern]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = 900 / rect.width;
      const scaleY = 630 / rect.height;
      const mouseBaseX = (e.clientX - rect.left) * scaleX;
      const mouseBaseY = (e.clientY - rect.top) * scaleY;

      if (dragRef.current) {
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
      }

      if (logoDragRef.current) {
        const newX = Math.max(0, mouseBaseX - logoDragRef.current.offsetX);
        const newY = Math.max(0, mouseBaseY - logoDragRef.current.offsetY);
        const draggingId = logoDragRef.current.id;
        setLogos((prev) =>
          prev.map((l) =>
            l.id === draggingId ? { ...l, x: newX, y: newY } : l,
          ),
        );
      }

      if (contentDragRef.current) {
        const newX = Math.max(0, mouseBaseX - contentDragRef.current.offsetX);
        const newY = Math.max(0, mouseBaseY - contentDragRef.current.offsetY);
        setContentPosition((prev) => ({
          x: newX,
          y: newY,
          width: prev?.width ?? 400,
          textAlign: prev?.textAlign ?? "left",
        }));
      }

      if (tagDragRef.current) {
        const newX = Math.max(0, mouseBaseX - tagDragRef.current.offsetX);
        const newY = Math.max(0, mouseBaseY - tagDragRef.current.offsetY);
        setTags((prev) =>
          prev.map((t) =>
            t.id === tagDragRef.current?.id ? { ...t, x: newX, y: newY } : t,
          ),
        );
      }
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      logoDragRef.current = null;
      contentDragRef.current = null;
      tagDragRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Sync templateTagPosition when the first tag's position/style changes
  useEffect(() => {
    if (tags.length > 0) {
      const t = tags[0];
      setTemplateTagPosition({
        x: t.x,
        y: t.y,
        borderWidth: t.borderWidth,
        borderColor: t.borderColor,
        borderRadius: t.borderRadius,
      });
    }
  }, [tags]);

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
          : backgroundType === "gradient" && selectedGradient !== undefined
            ? undefined
            : undefined;
      const url = await getNoiseDataUrl(noiseLevel, bgColor);
      if (!cancelled) setNoiseImageUrl(url);
    };
    generate();
    return () => {
      cancelled = true;
    };
  }, [noiseLevel, backgroundType, selectedSolidColor, selectedGradient]);

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
        shadowBlur: 10,
        shadowSpread: 2,
        shadowColor: "#7c3aed",
        shadowOpacity: 30,
      };
      if (isMultipleLogo) {
        setImages((prev) => [...prev, newImage]);
      } else {
        setImages([newImage]);
      }
      setSelectedImage(newImage.id);
      setImageControlsOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateTag = (id: string, updates: Partial<CanvasTag>) => {
    setTags((prev) =>
      prev.map((tag) => (tag.id === id ? { ...tag, ...updates } : tag)),
    );
  };

  const updateImage = (id: string, updates: Partial<CanvasImage>) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id !== id) return img;

        const updated = { ...img, ...updates };

        // Boundary constraints - X: -500 to 700, Y: -500 to 300
        updated.x = Math.min(700, Math.max(-500, updated.x));
        updated.y = Math.min(300, Math.max(-500, updated.y));
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

    const replaceId = logoReplaceRef.current;
    logoReplaceRef.current = null;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (replaceId) {
        setLogos((prev) =>
          prev.map((l) => (l.id === replaceId ? { ...l, src } : l)),
        );
        setSelectedLogoId(replaceId);
      } else {
        const id = `logo-${Date.now()}`;
        const newLogo: CanvasLogo = {
          id,
          src,
          x: 16,
          y: 16,
          width: 48,
          height: 48,
          borderRadius: 0,
        };
        if (isMultipleLogo) {
          setLogos((prev) => [...prev, newLogo]);
        } else {
          setLogos([newLogo]);
        }
        setSelectedLogoId(id);
      }
    };
    reader.readAsDataURL(file);

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

  const deleteLogo = (id?: string) => {
    if (id) {
      setLogos((prev) => prev.filter((l) => l.id !== id));
      if (selectedLogoId === id) setSelectedLogoId(null);
    } else {
      setLogos([]);
      setSelectedLogoId(null);
    }
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
    if (logos.length > 0) {
      const l = logos[0];
      shareParams.set(
        "logoPosition",
        JSON.stringify({
          x: l.x,
          y: l.y,
          width: l.width,
          height: l.height,
          borderRadius: l.borderRadius,
        }),
      );
      if (logos.length > 1) {
        shareParams.set(
          "logoPositions",
          JSON.stringify(
            logos.map((logo) => ({
              x: logo.x,
              y: logo.y,
              width: logo.width,
              height: logo.height,
              borderRadius: logo.borderRadius,
            })),
          ),
        );
      }
    }
    if (templateTag) shareParams.set("tag", templateTag);
    if (templateIsTag) shareParams.set("istag", "true");
    if (templateTagPosition)
      shareParams.set("tagPosition", JSON.stringify(templateTagPosition));

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

      const el = canvasRef.current;
      const baseW = el.offsetWidth;
      const baseH = el.offsetHeight;
      const scaleX = 1200 / baseW;
      const scaleY = 630 / baseH;

      const exportOptions = {
        width: 1200,
        height: 630,
        style: {
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
          width: `${baseW}px`,
          height: `${baseH}px`,
        },
        pixelRatio: 1,
        cacheBust: true,
      };

      let blob: Blob;

      if (exportFormat === "png") {
        const dataUrl = await toPng(el, exportOptions);
        blob = await (await fetch(dataUrl)).blob();
      } else if (exportFormat === "jpg") {
        const dataUrl = await toJpeg(el, {
          ...exportOptions,
          quality: 0.95,
        });
        blob = await (await fetch(dataUrl)).blob();
      } else {
        const pngDataUrl = await toPng(el, exportOptions);
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
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
          <Button variant="hero" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> Export PNG
          </Button>
        </div>
      </header>

      {(leftOpen || rightOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => {
            setLeftOpen(false);
            setRightOpen(false);
          }}
        />
      )}

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left Panel */}
        <div
          className={`${
            leftOpen ? "fixed inset-y-0 left-0 z-50 w-72 shadow-2xl" : "hidden"
          } lg:relative lg:z-auto lg:block lg:w-72 border-r border-border bg-card shrink-0 h-full overflow-hidden`}
        >
          <div
            className="p-3 space-y-4 w-72 overflow-y-auto no-scrollbar h-full"
            style={
              {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              } as React.CSSProperties
            }
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {/* <div className="pb-4 border-b border-border/30">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground rounded text-[10px] font-bold">
                  T
                </span>
                Content
              </h3>
            </div> */}
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

            {/* Tag Input */}
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Hexagon className="h-4 w-4" /> Tag
              </h3>
              {tags.length === 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    const text = templateTag || "Tag";
                    const pos = templateTagPosition || {
                      x: 20,
                      y: 20,
                      borderWidth: 1,
                      borderColor: "#3b82f6",
                      borderRadius: 10,
                    };
                    const newTag: CanvasTag = {
                      id: `tag-${Date.now()}-${Math.random()}`,
                      text,
                      x: pos.x,
                      y: pos.y,
                      borderWidth: pos.borderWidth,
                      borderColor: pos.borderColor,
                      borderRadius: pos.borderRadius,
                    };
                    setTags([newTag]);
                    setSelectedTagId(newTag.id);
                    setTemplateIsTag(true);
                  }}
                >
                  + Add Tag{templateTag ? ` "${templateTag}"` : ""}
                </Button>
              ) : (
                <Input
                  value={tags[0]?.text ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (tags[0]) updateTag(tags[0].id, { text: val });
                    setTemplateTag(val);
                    setTemplateIsTag(val.trim() !== "");
                  }}
                  className="bg-background border-border"
                />
              )}
            </div>

            <Separator className="bg-border" />

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

              {isMultipleLogo ? (
                <div className="space-y-2">
                  {logos.map((l) => (
                    <div
                      key={l.id}
                      className={`bg-background rounded-lg p-2 border flex items-center justify-between gap-2 cursor-pointer ${selectedLogoId === l.id ? "border-primary" : "border-border"}`}
                      onClick={() => setSelectedLogoId(l.id)}
                    >
                      <img
                        src={l.src}
                        alt="logo"
                        className="h-8 w-8 object-contain rounded"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            logoReplaceRef.current = l.id;
                            logoInputRef.current?.click();
                          }}
                          className="text-xs h-6 px-2 hover:bg-accent rounded transition-colors"
                        >
                          change
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLogo(l.id);
                          }}
                          className="p-1.5 hover:bg-destructive/20 rounded transition-colors text-xs"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      logoReplaceRef.current = null;
                      logoInputRef.current?.click();
                    }}
                  >
                    + Add Logo
                  </Button>
                </div>
              ) : (
                <>
                  {logos.length > 0 ? (
                    <div className="bg-background rounded-lg p-2 border border-border flex items-center justify-between gap-2">
                      <img
                        src={logos[0].src}
                        alt="logo"
                        className="h-10 w-10 object-contain"
                      />
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => logoInputRef.current?.click()}
                          className="text-xs h-8"
                        >
                          Change
                        </Button>
                        <button
                          onClick={() => deleteLogo(logos[0].id)}
                          className="p-2 hover:bg-destructive/20 rounded transition-colors"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs mb-3"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      + Add Logo
                    </Button>
                  )}
                </>
              )}
            </div>

            <Separator className="bg-border" />

            {/* Image Upload Section */}
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                Image
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {isMultipleLogo ? (
                <div className="space-y-2">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className={`bg-background rounded-lg p-2 border flex items-center justify-between gap-2 cursor-pointer ${selectedImage === img.id ? "border-primary" : "border-border"}`}
                      onClick={() => {
                        setSelectedImage(img.id);
                        setImageControlsOpen(true);
                      }}
                    >
                      <img
                        src={img.src}
                        alt="image"
                        className="h-8 w-10 object-cover rounded"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(img.id);
                        }}
                        className="p-1.5 hover:bg-destructive/20 rounded transition-colors"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    + Add Image
                  </Button>
                </div>
              ) : (
                <>
                  {images.length === 0 ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border bg-background/50 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      <span className="text-sm font-medium text-foreground">
                        Add Image
                      </span>
                      <span className="text-xs text-muted-foreground">
                        PNG, JPG or WEBP (Max. 5MB)
                      </span>
                    </div>
                  ) : (
                    <div className="bg-background rounded-lg p-3 border border-border flex items-center justify-between gap-2">
                      <img
                        src={images[0].src}
                        alt="image"
                        className="h-10 w-14 object-cover rounded"
                      />
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs h-8"
                        >
                          Change
                        </Button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteImage(images[0].id);
                          }}
                          className="p-2 hover:bg-destructive/20 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
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
                  setSelectedLogoId(null);
                  setSelectedTextElement(false);
                  setSelectedTagId(null);
                  setImageControlsOpen(false);
                  setSelectedShapeId(null);
                  if (
                    !selectedTool ||
                    selectedTool === "move" ||
                    selectedTool === "select"
                  )
                    return;
                }}
                style={{
                  width: "900px",
                  aspectRatio: "1200 / 630",
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "center",
                  transition: "transform 0.2s ease-out",
                  cursor: selectedTool === "move" ? "grab" : "default",
                  fontFamily: fontOptions[selectedFont],
                  ...(backgroundType === "gradient"
                    ? (() => {
                        const gradCSS = useCustomGradient
                          ? `linear-gradient(to bottom right, ${customGradientFrom}, ${customGradientTo})`
                          : gradientCSSMap[selectedGradient];
                        return {
                          backgroundColor: gradientUsesAlpha(gradCSS)
                            ? APP_BG_DARK
                            : "transparent",
                          backgroundImage:
                            noiseLevel > 0 && noiseImageUrl
                              ? `${gradCSS}, url(${noiseImageUrl})`
                              : gradCSS,
                          backgroundSize:
                            noiseLevel > 0 && noiseImageUrl
                              ? "100% 100%, 200px 200px"
                              : "100% 100%",
                        };
                      })()
                    : backgroundType === "solid"
                      ? {
                          backgroundColor: selectedSolidColor
                            ? colorHexMap[selectedSolidColor] || "#ffffff"
                            : "#ffffff",
                          backgroundImage: noiseImageUrl
                            ? `url(${noiseImageUrl})`
                            : "none",
                          backgroundSize: noiseImageUrl ? "200px 200px" : "0 0",
                        }
                      : {
                          backgroundColor:
                            selectedPattern !== null &&
                            patternMap[selectedPattern]
                              ? patternMap[selectedPattern].backgroundColor ||
                                "#ffffff"
                              : "#ffffff",
                          backgroundImage: "none",
                          backgroundSize: "100% 100%",
                        }),
                  backgroundRepeat: "repeat",
                  backgroundBlendMode: "normal",
                  filter: blurred ? "blur(1.5px)" : "none",
                }}
              >
                {backgroundType === "pattern" &&
                  selectedPattern !== null &&
                  patternMap[selectedPattern] && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage:
                          patternMap[selectedPattern].backgroundImage,
                        backgroundSize:
                          patternMap[selectedPattern].backgroundSize ||
                          undefined,
                        backgroundRepeat: "repeat",
                        ...(patternMap[selectedPattern].WebkitMaskImage
                          ? {
                              WebkitMaskImage:
                                patternMap[selectedPattern].WebkitMaskImage,
                            }
                          : {}),
                        ...(patternMap[selectedPattern].maskImage
                          ? { maskImage: patternMap[selectedPattern].maskImage }
                          : {}),
                        ...(patternMap[selectedPattern].WebkitMaskComposite
                          ? {
                              WebkitMaskComposite: patternMap[selectedPattern]
                                .WebkitMaskComposite as React.CSSProperties["WebkitMaskComposite"],
                            }
                          : {}),
                        ...(patternMap[selectedPattern].maskComposite
                          ? {
                              maskComposite: patternMap[selectedPattern]
                                .maskComposite as React.CSSProperties["maskComposite"],
                            }
                          : {}),
                      }}
                    />
                  )}
                {/* Render Images */}
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={`absolute ${isDragging ? "" : "transition-all duration-200"}`}
                    style={{
                      left: `${(img.x / 900) * 100}%`,
                      top: `${(img.y / 630) * 100}%`,
                      width: `${(img.width / 900) * 100}%`,
                      height: `${(img.height / 630) * 100}%`,
                      cursor:
                        selectedTool === "move"
                          ? "move"
                          : selectedTool === "select"
                            ? "pointer"
                            : "default",
                      transform: `rotate(${img.rotation || 0}deg)`,
                      touchAction: "none",
                      zIndex: getLayerZIndex("Image"),
                      outline:
                        selectedImage === img.id ? "3px solid #3b82f6" : "none",
                      outlineOffset: "2px",
                    }}
                    onClick={() => {
                      if (lockedLayers.has("Image")) return;
                      if (frameGridVisible) return;
                      setSelectedImage(img.id);
                      setSelectedLogoId(null);
                      setSelectedTextElement(false);
                      setImageControlsOpen(true);
                      setActiveSidebar("image");
                      setTimeout(
                        () =>
                          imageControlsRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          }),
                        50,
                      );
                    }}
                    onMouseDown={(e) => {
                      if (!canvasRef.current) return;
                      if (lockedLayers.has("Image")) return;
                      if (selectedTool !== "move") return;
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedImage(img.id);
                      setSelectedLogoId(null);
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
                          ((img.shadowBlur || 0) > 0 ||
                            (img.shadowSpread || 0) > 0) &&
                          (img.shadowOpacity || 0) > 0
                            ? `0 0 ${img.shadowBlur || 0}px ${img.shadowSpread || 0}px ${hexToRgba(img.shadowColor || "#000000", img.shadowOpacity || 0)}`
                            : "0 0 10px 2px rgba(124,58,237,0.3)",
                      }}
                    />
                  </div>
                ))}

                {/* Logos */}
                {logos.map((logo) => (
                  <div
                    key={logo.id}
                    className={`absolute flex items-center justify-center overflow-hidden ${isDragging ? "" : "transition-all duration-200"}`}
                    style={{
                      left: `${(logo.x / 900) * 100}%`,
                      top: `${(logo.y / 630) * 100}%`,
                      width: `${(logo.width / 900) * 100}%`,
                      // height: `${(logo.height / 630) * 100}%`,
                       aspectRatio: "1 / 1",
    height: "auto",
                      zIndex: getLayerZIndex("Logo"),
                      cursor:
                        selectedTool === "move"
                          ? "move"
                          : selectedTool === "select"
                            ? "pointer"
                            : "default",
                      outline:
                        selectedLogoId === logo.id
                          ? "3px solid #3b82f6"
                          : "none",
                      outlineOffset: "2px",
                      borderRadius: `${logo.borderRadius || 0}%`,
                    }}
                    onClick={() => {
                      if (frameGridVisible) return;
                      setSelectedLogoId(logo.id);
                      setSelectedImage(null);
                      setLogoControlsOpen(true);
                      setImageControlsOpen(true);
                      setActiveSidebar("logo");
                      setTimeout(
                        () =>
                          logoControlsRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                          }),
                        50,
                      );
                    }}
                    onMouseDown={(e) => {
                      if (selectedTool !== "move") return;
                      if (!canvasRef.current) return;
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedLogoId(logo.id);
                      setSelectedImage(null);
                      const rect = canvasRef.current.getBoundingClientRect();
                      const scaleX = 900 / rect.width;
                      const scaleY = 630 / rect.height;
                      const mouseBaseX = (e.clientX - rect.left) * scaleX;
                      const mouseBaseY = (e.clientY - rect.top) * scaleY;
                      logoDragRef.current = {
                        id: logo.id,
                        offsetX: mouseBaseX - logo.x,
                        offsetY: mouseBaseY - logo.y,
                      };
                      setIsDragging(true);
                    }}
                  >
                    <img
                      src={logo.src}
                      alt="logo"
                      className="w-full h-full object-cover"
                      style={{
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                ))}

                {/* Text Content */}
                <div
                  onClick={() => {
                    if (frameGridVisible) return;
                    setSelectedTextElement(true);
                    setSelectedLogoId(null);
                    setActiveSidebar("text");
                    setTimeout(
                      () =>
                        contentPositionRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                        }),
                      50,
                    );
                  }}
                  onMouseDown={(e) => {
                    if (selectedTool !== "move") return;
                    if (!canvasRef.current) return;
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedTextElement(true);
                    setSelectedImage(null);
                    setSelectedLogoId(null);
                    const rect = canvasRef.current.getBoundingClientRect();
                    const scaleX = 900 / rect.width;
                    const scaleY = 630 / rect.height;
                    const mouseBaseX = (e.clientX - rect.left) * scaleX;
                    const mouseBaseY = (e.clientY - rect.top) * scaleY;
                    const currentX = contentPosition?.x ?? 200;
                    const currentY = contentPosition?.y ?? 200;
                    if (!contentPosition) {
                      setContentPosition({
                        x: currentX,
                        y: currentY,
                        width: 400,
                        textAlign: "left",
                      });
                    }
                    contentDragRef.current = {
                      offsetX: mouseBaseX - currentX,
                      offsetY: mouseBaseY - currentY,
                    };
                    setIsDragging(true);
                  }}
                  style={{
                    ...getTextPositioning(),
                    cursor:
                      selectedTool === "move"
                        ? "move"
                        : selectedTool === "select"
                          ? "pointer"
                          : "default",
                    zIndex: Math.max(
                      getLayerZIndex("Text"),
                      getLayerZIndex("Subtitle"),
                    ),
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
                  {showSubtitle && subtitle && (
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

                {/* Frame Grid Overlay */}
                {frameGridVisible && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: 6 }}
                  >
                    {/* Outer border */}
                    <div
                      className="absolute inset-0"
                      style={{
                        border: "2px solid rgba(255,255,255,0.5)",
                        borderRadius: "0",
                      }}
                    />
                    {/* Vertical lines */}
                    <svg className="absolute inset-0 w-full h-full">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <line
                          key={`v-${i}`}
                          x1={`${((i + 1) / 13) * 100}%`}
                          y1="0"
                          x2={`${((i + 1) / 13) * 100}%`}
                          y2="100%"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="1"
                        />
                      ))}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <line
                          key={`h-${i}`}
                          x1="0"
                          y1={`${((i + 1) / 9) * 100}%`}
                          x2="100%"
                          y2={`${((i + 1) / 9) * 100}%`}
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="1"
                        />
                      ))}
                    </svg>
                  </div>
                )}

                {/* Tags */}
                {tags.map((tag) => {
                  const isSelected = selectedTagId === tag.id;
                  return (
                    <div
                      key={tag.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTagId(tag.id);
                        setSelectedImage(null);
                        setSelectedLogoId(null);
                        setSelectedTextElement(false);
                        setSelectedShapeId(null);
                      }}
                      onMouseDown={(e) => {
                        if (selectedTool !== "move") return;
                        if (!canvasRef.current) return;
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedTagId(tag.id);
                        setSelectedImage(null);
                        setSelectedLogoId(null);
                        setSelectedTextElement(false);
                        setSelectedShapeId(null);
                        const rect = canvasRef.current.getBoundingClientRect();
                        const scaleX = 900 / rect.width;
                        const scaleY = 630 / rect.height;
                        const mouseBaseX = (e.clientX - rect.left) * scaleX;
                        const mouseBaseY = (e.clientY - rect.top) * scaleY;
                        tagDragRef.current = {
                          id: tag.id,
                          offsetX: mouseBaseX - tag.x,
                          offsetY: mouseBaseY - tag.y,
                        };
                        setIsDragging(true);
                      }}
                      style={{
                        position: "absolute",
                        left: `${(tag.x / 900) * 100}%`,
                        top: `${(tag.y / 630) * 100}%`,
                        border: `${tag.borderWidth}px solid ${tag.borderColor}`,
                        borderRadius: tag.borderRadius,
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: tag.borderColor,
                        cursor: selectedTool === "move" ? "move" : "pointer",
                        zIndex: getLayerZIndex("Tag"),
                        userSelect: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tag.text}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Toolbar */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-sm p-2 shadow-lg">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSelectedTool("select")}
                  className={`p-2 rounded-sm transition-colors ${
                    selectedTool === "select"
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <MousePointer2 className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Select</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSelectedTool("move")}
                  className={`p-2 rounded-sm transition-colors ${
                    selectedTool === "move"
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <Move className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Move</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setFrameGridVisible((prev) => !prev)}
                  className={`p-2 rounded-sm transition-colors ${
                    frameGridVisible
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <Frame className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Frame</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Right Panel */}
        <div
          className={`${
            rightOpen
              ? "fixed inset-y-0 right-0 z-50 w-80 shadow-2xl"
              : "hidden"
          } lg:relative lg:z-auto lg:block lg:w-80 border-l border-border bg-card shrink-0 h-full flex flex-col overflow-y-auto overflow-x-hidden`}
        >
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
          <div
            ref={rightPanelRef}
            className="flex-1 p-4 space-y-6 w-80 overflow-y-auto"
          >
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
                    <button
                      onClick={() => setBackgroundType("pattern")}
                      className={`flex-1 py-1.5 px-2 text-xs rounded-sm border transition-all duration-150 ${
                        backgroundType === "pattern"
                          ? "border-primary bg-primary/10 text-foreground font-medium"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      }`}
                    >
                      Pattern
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
                              <Skeleton
                                key={i}
                                className="aspect-square rounded-sm"
                              />
                            ))
                          : gradients.slice(0, 12).map((g, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  setSelectedGradient(i);
                                  setUseCustomGradient(false);
                                }}
                                className={`aspect-square rounded-sm border transition-all duration-150 ${
                                  selectedGradient === i && !useCustomGradient
                                    ? "border-primary ring-2 ring-primary"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                                style={{ background: gradientCSSMap[i] }}
                                title={`Gradient ${i + 1}`}
                              />
                            ))}
                        {showAllGradients &&
                          !initialLoading &&
                          (gradientsLoading
                            ? Array.from({ length: gradients.length - 12 }).map(
                                (_, i) => (
                                  <Skeleton
                                    key={`grad-sk-${i}`}
                                    className="aspect-square rounded-sm"
                                  />
                                ),
                              )
                            : gradients.slice(12).map((g, i) => (
                                <button
                                  key={`gradient-${i + 12}`}
                                  onClick={() => {
                                    setSelectedGradient(i + 12);
                                    setUseCustomGradient(false);
                                  }}
                                  className={`aspect-square rounded-sm border transition-all duration-150 ${
                                    selectedGradient === i + 12 &&
                                    !useCustomGradient
                                      ? "border-primary ring-2 ring-primary"
                                      : "border-border hover:border-muted-foreground"
                                  }`}
                                  style={{ background: gradientCSSMap[i + 12] }}
                                  title={`Gradient ${i + 13}`}
                                />
                              )))}
                        {!initialLoading && (
                          <button
                            onClick={() => {
                              setCustomizeOpen(!customizeOpen);
                              if (!customizeOpen) setUseCustomGradient(true);
                            }}
                            className={`aspect-square rounded-sm border transition-all duration-150 flex items-center justify-center text-[8px] font-medium leading-tight ${
                              useCustomGradient
                                ? "border-primary ring-2 ring-primary bg-primary/10 text-foreground"
                                : "border-border hover:border-muted-foreground text-muted-foreground bg-background"
                            }`}
                            title="Customize gradient"
                          >
                            <Settings2
                              className={`h-4 w-4 ${useCustomGradient ? "text-foreground" : "text-muted-foreground"}`}
                            />
                          </button>
                        )}
                        {!initialLoading && gradients.length > 13 && (
                          <button
                            onClick={() => {
                              if (!showAllGradients) {
                                setShowAllGradients(true);
                                setGradientsLoading(true);
                                setTimeout(
                                  () => setGradientsLoading(false),
                                  500,
                                );
                              } else {
                                setShowAllGradients(false);
                              }
                            }}
                            className="aspect-square rounded-sm border border-border hover:border-muted-foreground transition-all duration-150 flex items-center justify-center bg-background"
                            title={
                              showAllGradients
                                ? "Show less"
                                : "Show all gradients"
                            }
                          >
                            <ChevronDown
                              className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${showAllGradients ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </div>

                      {customizeOpen && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            Custom Gradient
                          </Label>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <ColorRow
                                label="From"
                                value={customGradientFrom}
                                onChange={(color) => {
                                  setCustomGradientFrom(color);
                                  setUseCustomGradient(true);
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <ColorRow
                                label="To"
                                value={customGradientTo}
                                onChange={(color) => {
                                  setCustomGradientTo(color);
                                  setUseCustomGradient(true);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
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
                              <Skeleton
                                key={i}
                                className="aspect-square rounded-sm"
                              />
                            ))
                          : solidColors
                              .slice(0, 13)
                              .map((color, i) => (
                                <button
                                  key={i}
                                  onClick={() => setSelectedSolidColor(color)}
                                  className={`aspect-square rounded-sm ${color} border-2 transition-all duration-150 ${
                                    selectedSolidColor === color
                                      ? "border-white ring-2 ring-white"
                                      : "border-border hover:border-gray-400"
                                  }`}
                                  title={color}
                                />
                              ))}
                        {showAllSolidColors &&
                          !initialLoading &&
                          (solidColorsLoading
                            ? Array.from({
                                length: solidColors.length - 13,
                              }).map((_, i) => (
                                <Skeleton
                                  key={`solid-sk-${i}`}
                                  className="aspect-square rounded-sm"
                                />
                              ))
                            : solidColors
                                .slice(13)
                                .map((color, i) => (
                                  <button
                                    key={`solid-${i + 13}`}
                                    onClick={() => setSelectedSolidColor(color)}
                                    className={`aspect-square rounded-sm ${color} border-2 transition-all duration-150 ${
                                      selectedSolidColor === color
                                        ? "border-white ring-2 ring-white"
                                        : "border-border hover:border-gray-400"
                                    }`}
                                    title={color}
                                  />
                                )))}
                        {!initialLoading && solidColors.length > 13 && (
                          <button
                            onClick={() => {
                              if (!showAllSolidColors) {
                                setShowAllSolidColors(true);
                                setSolidColorsLoading(true);
                                setTimeout(
                                  () => setSolidColorsLoading(false),
                                  500,
                                );
                              } else {
                                setShowAllSolidColors(false);
                              }
                            }}
                            className="aspect-square rounded-sm border-2 border-border hover:border-gray-400 transition-all duration-150 flex items-center justify-center bg-transparent"
                            title={
                              showAllSolidColors
                                ? "Show less"
                                : "Show all colors"
                            }
                          >
                            <ChevronDown
                              className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${showAllSolidColors ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Patterns */}
                  {backgroundType === "pattern" && (
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">
                        Patterns
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {patternMap.map((pattern, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedPattern(i)}
                            className={`relative rounded-sm border-2 overflow-hidden transition-all duration-150 ${
                              selectedPattern === i
                                ? "border-primary ring-2 ring-primary"
                                : "border-border hover:border-muted-foreground"
                            }`}
                            title={pattern.name}
                            style={{ aspectRatio: "16 / 10" }}
                          >
                            <div
                              className="absolute inset-0"
                              style={{
                                backgroundColor:
                                  pattern.backgroundColor || "#ffffff",
                              }}
                            >
                              <div
                                className="absolute inset-0"
                                style={{
                                  backgroundImage: pattern.backgroundImage,
                                  backgroundSize:
                                    pattern.backgroundSize || undefined,
                                  backgroundRepeat: "repeat",
                                  WebkitMaskImage:
                                    pattern.WebkitMaskImage || undefined,
                                  maskImage: pattern.maskImage || undefined,
                                  WebkitMaskComposite:
                                    (pattern.WebkitMaskComposite as React.CSSProperties["WebkitMaskComposite"]) ||
                                    undefined,
                                  maskComposite:
                                    (pattern.maskComposite as React.CSSProperties["maskComposite"]) ||
                                    undefined,
                                }}
                              />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-1">
                              <span className="text-[10px] text-white font-medium block truncate">
                                {pattern.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {backgroundType !== "pattern" && (
                    <>
                      <Separator className="bg-border my-3" />
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
                    </>
                  )}
                  <Separator className="bg-border" />

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
                                    X Position (-500 to 700)
                                  </Label>
                                  <Input
                                    type="number"
                                    min="-500"
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
                                        Math.max(-500, isNaN(val) ? 0 : val),
                                      );
                                      updateImage(selectedImage, {
                                        x: clamped,
                                      });
                                    }}
                                    className="mt-1 bg-card border-border text-xs"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Y Position (-500 to 300)
                                  </Label>
                                  <Input
                                    type="number"
                                    min="-500"
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
                                        Math.max(-500, isNaN(val) ? 0 : val),
                                      );
                                      updateImage(selectedImage, {
                                        y: clamped,
                                      });
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
                                    images.find(
                                      (img) => img.id === selectedImage,
                                    )?.borderColor || "#000000"
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
                                    images.find(
                                      (img) => img.id === selectedImage,
                                    )?.rotation || 0
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
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator className="bg-border" />
                    </>
                  )}

                {activeLogo && (
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
                                value={activeLogo.x}
                                onChange={(e) =>
                                  updateLogo(activeLogo.id, {
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
                                value={activeLogo.y}
                                onChange={(e) =>
                                  updateLogo(activeLogo.id, {
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
                                value={activeLogo.width}
                                onChange={(e) =>
                                  updateLogo(activeLogo.id, {
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
                                value={activeLogo.height}
                                onChange={(e) =>
                                  updateLogo(activeLogo.id, {
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
                              value={activeLogo.borderRadius || 0}
                              onChange={(e) =>
                                updateLogo(activeLogo.id, {
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
                <div ref={contentPositionRef}>
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

                {/* Tag Settings */}
                {selectedTagId &&
                  (() => {
                    const tag = tags.find((t) => t.id === selectedTagId);
                    if (!tag) return null;
                    return (
                      <div ref={tagControlsRef}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Hexagon className="h-4 w-4" /> Tag
                          </h3>
                          <button
                            onClick={() => {
                              setTags([]);
                              setSelectedTagId(null);
                              setTemplateTag("");
                              setTemplateIsTag(false);
                              setTemplateTagPosition(null);
                            }}
                            className="p-1 hover:bg-destructive/20 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                        <div className="bg-background rounded-lg p-3 border border-border space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Border Radius
                              </Label>
                              <Input
                                type="number"
                                min={0}
                                max={50}
                                value={tag.borderRadius}
                                onChange={(e) =>
                                  updateTag(tag.id, {
                                    borderRadius: Math.max(
                                      0,
                                      Number(e.target.value) || 0,
                                    ),
                                  })
                                }
                                className="mt-1 bg-card border-border text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Border Size
                              </Label>
                              <Input
                                type="number"
                                min={0}
                                max={10}
                                value={tag.borderWidth}
                                onChange={(e) =>
                                  updateTag(tag.id, {
                                    borderWidth: Math.max(
                                      0,
                                      Number(e.target.value) || 0,
                                    ),
                                  })
                                }
                                className="mt-1 bg-card border-border text-xs"
                              />
                            </div>
                          </div>

                          <ColorRow
                            label="Border Color"
                            value={tag.borderColor}
                            onChange={(color) =>
                              updateTag(tag.id, { borderColor: color })
                            }
                          />
                        </div>
                      </div>
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
                      <Skeleton
                        key={i}
                        className="w-full aspect-[1200/630] rounded-lg"
                      />
                    ))
                  : templates.map((template) => {
                      return (
                        <button
                          key={template.id}
                          onClick={() => {
                            handleTemplateSelect(template);
                            setRightTab("design");
                          }}
                          className={`group w-full aspect-[1200/630] rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-200 text-left relative ${template.preview.bg?.startsWith("from-") ? `bg-card bg-gradient-to-br ${template.preview.bg}` : "bg-card"}`}
                          style={(() => {
                            if (
                              "pattern" in template &&
                              template.pattern !== undefined
                            ) {
                              const p = patternMap[template.pattern as number];
                              if (p)
                                return {
                                  backgroundColor: p.backgroundColor,
                                  backgroundImage: p.backgroundImage,
                                  backgroundSize: p.backgroundSize || undefined,
                                };
                            }
                            if (!template.gradient.startsWith("from-")) {
                              const g = gradientMap.find(
                                (g) => g.tailwind === template.gradient,
                              );
                              if (g) return { background: g.css };
                            }
                            return undefined;
                          })()}
                        >
                          <div className="absolute inset-0 transition-all duration-200 ">
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
                                      template.contentPosition.textAlign ??
                                      "left",
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
                                      template.contentPosition.textAlign ??
                                      "left",
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
      <Dialog
        open={!!layerDeleteConfirm}
        onOpenChange={() => setLayerDeleteConfirm(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Layer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{layerDeleteConfirm}" layer?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLayerDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                layerDeleteConfirm && handleLayerDelete(layerDeleteConfirm)
              }
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
            <DialogDescription>Choose your preferred format.</DialogDescription>
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
              <div className="w-full mt-2 px-3 py-2 bg-card border border-border rounded text-sm text-foreground">
                1200 × 630 (Standard)
              </div>
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
