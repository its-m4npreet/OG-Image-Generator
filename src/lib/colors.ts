// Unified gradient mapping - Tailwind class to CSS gradient
export const gradientMap = [
  { tailwind: "from-primary/40 to-primary/5", css: "linear-gradient(to bottom right, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.05))" },
  { tailwind: "from-secondary/20 to-primary/10", css: "linear-gradient(to bottom right, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.1))" },
  { tailwind: "from-purple-600/30 to-blue-600/10", css: "linear-gradient(to bottom right, rgba(147, 112, 219, 0.3), rgba(37, 99, 235, 0.1))" },

  { tailwind: "from-violet-600/30 to-indigo-600/20", css: "linear-gradient(to bottom right, rgba(109, 40, 217, 0.3), rgba(79, 70, 229, 0.2))" },

  { tailwind: "from-pink-500 to-rose-400", css: "linear-gradient(to bottom right, #ec4899, #f43f5e)" },

  { tailwind: "from-blue-500 to-purple-400", css: "linear-gradient(to bottom right, #3b82f6, #a855f7)" },
  { tailwind: "from-blue-400 to-indigo-300", css: "linear-gradient(to bottom right, #60a5fa, #818cf8)" },
  { tailwind: "from-purple-500 to-pink-400", css: "linear-gradient(to bottom right, #a855f7, #ec4899)" },

  { tailwind: "from-indigo-500 to-purple-300", css: "linear-gradient(to bottom right, #6366f1, #a78bfa)" },
  { tailwind: "from-cyan-500 to-blue-400", css: "linear-gradient(to bottom right, #06b6d4, #3b82f6)" },
  { tailwind: "from-green-500 to-emerald-400", css: "linear-gradient(to bottom right, #22c55e, #10b981)" },
  { tailwind: "from-green-400 to-cyan-400", css: "linear-gradient(to bottom right, #4ade80, #06b6d4)" },

  // New Premium Gradients (Blog)
  { tailwind: "from-[#0F172A] via-[#111827] to-[#1E293B]", css: "linear-gradient(to bottom right, #0F172A, #111827, #1E293B)" },
  { tailwind: "from-[#172554] via-[#1E3A8A] to-[#2563EB]", css: "linear-gradient(to bottom right, #172554, #1E3A8A, #2563EB)" },
  { tailwind: "from-[#020617] via-[#111827] to-[#334155]", css: "linear-gradient(to bottom right, #020617, #111827, #334155)" },
  
  // New Premium Gradients (SaaS)
  { tailwind: "from-[#7C2D12] via-[#C2410C] to-[#FB7185]", css: "linear-gradient(to bottom right, #7C2D12, #C2410C, #FB7185)" },

  // New Premium Gradients (Portfolio)
  { tailwind: "from-[#4C1D95] via-[#7E22CE] to-[#DB2777]", css: "linear-gradient(to bottom right, #4C1D95, #7E22CE, #DB2777)" },
  { tailwind: "from-[#064E3B] via-[#065F46] to-[#0F766E]", css: "linear-gradient(to bottom right, #064E3B, #065F46, #0F766E)" },
  
  // New Premium Gradients (Product Launch)
  { tailwind: "from-[#2E1065] via-[#4C1D95] to-[#7C3AED]", css: "linear-gradient(to bottom right, #2E1065, #4C1D95, #7C3AED)" },
  
  // New Premium Templates Gradients
  { tailwind: "from-[#020617] via-[#0F172A] to-[#1E293B]", css: "linear-gradient(to bottom right, #020617, #0F172A, #1E293B)" },
  { tailwind: "from-[#312E81] via-[#4338CA] to-[#818CF8]", css: "linear-gradient(to bottom right, #312E81, #4338CA, #818CF8)" },
  { tailwind: "from-[#7C2D12] via-[#EA580C] to-[#FDBA74]", css: "linear-gradient(to bottom right, #7C2D12, #EA580C, #FDBA74)" },
  { tailwind: "from-[#172554] via-[#2563EB] to-[#60A5FA]", css: "linear-gradient(to bottom right, #172554, #2563EB, #60A5FA)" },

  // Premium Radial Gradients
  { tailwind: "radial-teal-glow", css: "radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)" },
  { tailwind: "radial-slate-glow", css: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #475569 100%)" },
  { tailwind: "radial-orchid-depths", css: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #350136 100%)" },
  { tailwind: "radial-azure-depths", css: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #010133 100%)" },

  // Aurora Dream Gradients
  { tailwind: "aurora-dream-vivid-bloom", css: "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175, 109, 255, 0.85), transparent 68%), radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%), radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.98), transparent 68%), radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.3), transparent 68%), linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)" },
  { tailwind: "aurora-dream-diagonal-flow", css: "radial-gradient(ellipse 80% 60% at 5% 40%, rgba(175, 109, 255, 0.48), transparent 67%), radial-gradient(ellipse 70% 60% at 45% 45%, rgba(255, 100, 180, 0.41), transparent 67%), radial-gradient(ellipse 62% 52% at 83% 76%, rgba(255, 235, 170, 0.44), transparent 63%), radial-gradient(ellipse 60% 48% at 75% 20%, rgba(120, 190, 255, 0.36), transparent 66%), linear-gradient(45deg, #f7eaff 0%, #fde2ea 100%)" },
  { tailwind: "dreamy-sunset-gradient", css: "linear-gradient(180deg, rgba(245,245,220,1) 0%, rgba(255,223,186,0.8) 25%, rgba(255,182,193,0.6) 50%, rgba(147,112,219,0.7) 75%, rgba(72,61,139,0.9) 100%), radial-gradient(circle at 30% 20%, rgba(255,255,224,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(72,61,139,0.6) 0%, transparent 70%), radial-gradient(circle at 50% 60%, rgba(147,112,219,0.3) 0%, transparent 60%)" },
  { tailwind: "yellow-corner-bright", css: "radial-gradient(circle 600px at 0% 200px, #fef3c7, transparent), radial-gradient(circle 600px at 100% 200px, #fef3c7, transparent)" },

  // Dark Cosmic Gradients
  { tailwind: "cosmic-nebula", css: "radial-gradient(ellipse 110% 70% at 25% 80%, rgba(147, 51, 234, 0.12), transparent 55%), radial-gradient(ellipse 130% 60% at 75% 15%, rgba(59, 130, 246, 0.10), transparent 65%), radial-gradient(ellipse 80% 90% at 20% 30%, rgba(236, 72, 153, 0.14), transparent 50%), radial-gradient(ellipse 100% 40% at 60% 70%, rgba(16, 185, 129, 0.08), transparent 45%)" },
  { tailwind: "stellar-mist", css: "radial-gradient(ellipse 140% 50% at 15% 60%, rgba(124, 58, 237, 0.11), transparent 48%), radial-gradient(ellipse 90% 80% at 85% 25%, rgba(245, 101, 101, 0.09), transparent 58%), radial-gradient(ellipse 120% 65% at 40% 90%, rgba(34, 197, 94, 0.13), transparent 52%), radial-gradient(ellipse 100% 45% at 70% 5%, rgba(251, 191, 36, 0.07), transparent 42%), radial-gradient(ellipse 80% 75% at 90% 80%, rgba(168, 85, 247, 0.10), transparent 55%)" },
  { tailwind: "pearl-mist", css: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 70%)" },
];

// Check if a gradient CSS uses rgba/hsla with alpha < 1 (needs a solid background)
export const gradientUsesAlpha = (css: string): boolean => {
  return /rgba\(|hsla\(/.test(css);
};

// App dark background color
export const APP_BG_DARK = "#09090d";

// Extract arrays for backward compatibility
export const gradients = gradientMap.map(g => g.tailwind);
export const gradientCSSMap = gradientMap.map(g => g.css);

export const solidColors = [
  "bg-gray-800",
  "bg-zinc-800",
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
];

// Color hex mapping for Tailwind classes
export const colorHexMap: Record<string, string> = {
  "bg-gray-800": "#1f2937",
  "bg-zinc-800": "#27272a",
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

// Function to detect if color is light or dark
export const isLightColor = (hexColor: string): boolean => {
  if (!hexColor || !hexColor.startsWith("#")) return false;
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

// Function to generate adaptive noise SVG pattern
export const getNoiseSVG = (noiseLevel: number, bgColor?: string): string => {
  if (noiseLevel === 0) return "";
  
  const isLight = bgColor ? isLightColor(bgColor) : false;
  const opacity = Math.min((noiseLevel / 100) * 0.8, 0.8);
  
  // Use darker noise for light backgrounds, lighter noise for dark backgrounds
  const noiseColor = isLight ? "%23333333" : "%23FFFFFF"; // Dark gray for light, white for dark
  const noiseOpacity = isLight ? Math.min((noiseLevel / 100) * 0.6, 0.6) : opacity;
  
  return `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='1' result='noise'/%3E%3C/filter%3E%3Crect width='100' height='100' fill='${noiseColor}' opacity='${noiseOpacity}' filter='url(%23n)'/%3E%3C/svg%3E")`;
};

const noiseImageCache = new Map<string, string>();

export async function getNoiseDataUrl(noiseLevel: number, bgColor?: string): Promise<string> {
  if (noiseLevel <= 0) return "";

  const isLight = bgColor ? isLightColor(bgColor) : false;
  const noiseColor = isLight ? "#333333" : "#FFFFFF";
  const opacity = isLight
    ? Math.min((noiseLevel / 100) * 0.6, 0.6)
    : Math.min((noiseLevel / 100) * 0.8, 0.8);

  const cacheKey = `${noiseLevel}-${noiseColor}-${opacity}`;
  if (noiseImageCache.has(cacheKey)) return noiseImageCache.get(cacheKey)!;

  const size = 200;
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" seed="1"/>
    </filter>
    <rect width="${size}" height="${size}" fill="${noiseColor}" opacity="${opacity}" filter="url(#n)"/>
  </svg>`;

  const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const dataUrl = canvas.toDataURL("image/png");
    noiseImageCache.set(cacheKey, dataUrl);
    return dataUrl;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const patternMap = [
  {
    name: "Fade Grid TL",
    backgroundColor: "#f9fafb",
    backgroundImage:
      "linear-gradient(to right, #d1d5db 1px, transparent 1px), linear-gradient(to bottom, #d1d5db 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    WebkitMaskImage:
      "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
    maskImage:
      "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
  },
  {
    name: "Fade Grid TR",
    backgroundColor: "#f9fafb",
    backgroundImage:
      "linear-gradient(to right, #d1d5db 1px, transparent 1px), linear-gradient(to bottom, #d1d5db 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    WebkitMaskImage:
      "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
    maskImage:
      "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
  },
  {
    name: "Fade Grid Center",
    backgroundColor: "#f9fafb",
    backgroundImage:
      "linear-gradient(to right, #d1d5db 1px, transparent 1px), linear-gradient(to bottom, #d1d5db 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    WebkitMaskImage:
      "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
    maskImage:
      "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
  },
  {
    name: "Diagonal Cross",
    backgroundColor: "#ffffff",
    backgroundImage:
      "linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)",
    backgroundSize: "40px 40px",
  },
  {
    name: "Cross Top Fade",
    backgroundColor: "#ffffff",
    backgroundImage:
      "linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)",
    backgroundSize: "40px 40px",
    WebkitMaskImage:
      "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
    maskImage:
      "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
  },
  {
    name: "Dashed Grid",
    backgroundColor: "#ffffff",
    backgroundImage:
      "linear-gradient(to right, #e7e5e4 1px, transparent 1px), linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    WebkitMaskImage:
      "repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px), repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px)",
    maskImage:
      "repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px), repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px)",
    WebkitMaskComposite: "source-in",
    maskComposite: "intersect",
  },
  {
    name: "Paper Texture",
    backgroundColor: "#faf9f6",
    backgroundImage:
      "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)",
    backgroundSize: "8px 8px, 32px 32px, 32px 32px",
  },
  {
    name: "Diagonal Stripes",
    backgroundColor: "#ffffff",
    backgroundImage:
      "repeating-linear-gradient(45deg, transparent, transparent 2px, #f3f4f6 2px, #f3f4f6 4px)",
  },
  {
    name: "Crosshatch Light",
    backgroundColor: "#ffffff",
    backgroundImage:
      "repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px), repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px), repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px), repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)",
  },
  {
    name: "Glow Grid",
    backgroundColor: "#0f0f0f",
    backgroundImage:
      "repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px), repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)",
    backgroundSize: "44px 44px",
  },
  {
    name: "Crosshatch Dark",
    backgroundColor: "#0f0f0f",
    backgroundImage:
      "repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(16, 185, 129, 0.18) 2px, rgba(16, 185, 129, 0.18) 3px, transparent 3px, transparent 8px), repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(245, 101, 101, 0.10) 2px, rgba(245, 101, 101, 0.10) 3px, transparent 3px, transparent 8px), repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(234, 179, 8, 0.08) 2px, rgba(234, 179, 8, 0.08) 3px, transparent 3px, transparent 8px), repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(249, 115, 22, 0.06) 2px, rgba(249, 115, 22, 0.06) 3px, transparent 3px, transparent 8px)",
  },
  {
    name: "Variable Spacing",
    backgroundColor: "#0f0f0f",
    backgroundImage:
      "repeating-linear-gradient(30deg, rgba(255, 100, 0, 0.1) 0, rgba(255, 100, 0, 0.1) 1px, transparent 1px, transparent 10px, rgba(255, 100, 0, 0.15) 11px, rgba(255, 100, 0, 0.15) 12px, transparent 12px, transparent 40px)",
  },
];

// Check if background is light or dark based on gradient/color/pattern selection
export const isLightBackground = (
  backgroundType: string,
  selectedGradient: number,
  selectedSolidColor: string | null,
  selectedPattern: number | null,
): boolean => {
  if (backgroundType === "gradient") {
    if (selectedGradient >= 25 && selectedGradient <= 30) return true;
    if (selectedGradient >= 31) return false;
    return selectedGradient >= 16;
  }
  if (backgroundType === "pattern" && selectedPattern !== null && patternMap[selectedPattern]) {
    const bg = patternMap[selectedPattern].backgroundColor || "#ffffff";
    const hex = bg.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
  }
  return selectedSolidColor?.includes("-100") ?? false;
};
