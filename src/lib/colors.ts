// Unified gradient mapping - Tailwind class to CSS gradient
export const gradientMap = [
  { tailwind: "from-primary/40 to-primary/5", css: "linear-gradient(to bottom right, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.05))" },
  { tailwind: "from-secondary/20 to-primary/10", css: "linear-gradient(to bottom right, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.1))" },
  { tailwind: "from-purple-600/30 to-blue-600/10", css: "linear-gradient(to bottom right, rgba(147, 112, 219, 0.3), rgba(37, 99, 235, 0.1))" },
  { tailwind: "from-blue-600/30 to-cyan-500/20", css: "linear-gradient(to bottom right, rgba(37, 99, 235, 0.3), rgba(34, 197, 94, 0.2))" },
  { tailwind: "from-teal-500/30 to-cyan-500/20", css: "linear-gradient(to bottom right, rgba(20, 184, 166, 0.3), rgba(34, 211, 238, 0.2))" },
  { tailwind: "from-violet-600/30 to-indigo-600/20", css: "linear-gradient(to bottom right, rgba(109, 40, 217, 0.3), rgba(79, 70, 229, 0.2))" },
  { tailwind: "from-fuchsia-600/30 to-pink-500/20", css: "linear-gradient(to bottom right, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.2))" },
  
  { tailwind: "from-red-500 to-orange-400", css: "linear-gradient(to bottom right, #ef4444, #fb923c)" },
  { tailwind: "from-pink-500 to-rose-400", css: "linear-gradient(to bottom right, #ec4899, #f43f5e)" },
  { tailwind: "from-pink-400 to-red-300", css: "linear-gradient(to bottom right, #ec4899, #fca5a5)" },
  { tailwind: "from-cyan-300 to-blue-100", css: "linear-gradient(to bottom right, #67e8f9, #3b82f6)" },
  { tailwind: "from-blue-500 to-purple-400", css: "linear-gradient(to bottom right, #3b82f6, #a855f7)" },
  { tailwind: "from-blue-400 to-indigo-300", css: "linear-gradient(to bottom right, #60a5fa, #818cf8)" },
  { tailwind: "from-purple-500 to-pink-400", css: "linear-gradient(to bottom right, #a855f7, #ec4899)" },
  { tailwind: "from-purple-400 to-blue-300", css: "linear-gradient(to bottom right, #a78bfa, #60a5fa)" },
  { tailwind: "from-indigo-500 to-purple-300", css: "linear-gradient(to bottom right, #6366f1, #a78bfa)" },
  { tailwind: "from-cyan-500 to-blue-400", css: "linear-gradient(to bottom right, #06b6d4, #3b82f6)" },
  { tailwind: "from-green-500 to-emerald-400", css: "linear-gradient(to bottom right, #22c55e, #10b981)" },
  { tailwind: "from-green-400 to-cyan-400", css: "linear-gradient(to bottom right, #4ade80, #06b6d4)" },
  { tailwind: "from-emerald-500 to-teal-400", css: "linear-gradient(to bottom right, #10b981, #14b8a6)" },
  { tailwind: "from-teal-500 to-cyan-300", css: "linear-gradient(to bottom right, #14b8a6, #67e8f9)" },
  { tailwind: "from-cyan-400 to-green-300", css: "linear-gradient(to bottom right, #06b6d4, #86efac)" },
  { tailwind: "from-slate-700 to-slate-500", css: "linear-gradient(to bottom right, #475569, #64748b)" },
  { tailwind: "from-red-500 to-pink-500", css: "linear-gradient(to bottom right, #ef4444, #ec4899)" },
  { tailwind: "from-purple-400 to-pink-400", css: "linear-gradient(to bottom right, #a78bfa, #f472b6)" },
  
  // New Premium Gradients (Blog)
  { tailwind: "from-[#0F172A] via-[#111827] to-[#1E293B]", css: "linear-gradient(to bottom right, #0F172A, #111827, #1E293B)" },
  { tailwind: "from-[#172554] via-[#1E3A8A] to-[#2563EB]", css: "linear-gradient(to bottom right, #172554, #1E3A8A, #2563EB)" },
  { tailwind: "from-[#020617] via-[#111827] to-[#334155]", css: "linear-gradient(to bottom right, #020617, #111827, #334155)" },
  
  // New Premium Gradients (SaaS)
  { tailwind: "from-[#312E81] via-[#4338CA] to-[#6366F1]", css: "linear-gradient(to bottom right, #312E81, #4338CA, #6366F1)" },
  { tailwind: "from-[#7C2D12] via-[#C2410C] to-[#FB7185]", css: "linear-gradient(to bottom right, #7C2D12, #C2410C, #FB7185)" },
  { tailwind: "from-[#083344] via-[#155E75] to-[#67E8F9]", css: "linear-gradient(to bottom right, #083344, #155E75, #67E8F9)" },
  
  // New Premium Gradients (Portfolio)
  { tailwind: "from-[#4C1D95] via-[#7E22CE] to-[#DB2777]", css: "linear-gradient(to bottom right, #4C1D95, #7E22CE, #DB2777)" },
  { tailwind: "from-[#064E3B] via-[#065F46] to-[#0F766E]", css: "linear-gradient(to bottom right, #064E3B, #065F46, #0F766E)" },
  
  // New Premium Gradients (Product Launch)
  { tailwind: "from-[#2E1065] via-[#4C1D95] to-[#7C3AED]", css: "linear-gradient(to bottom right, #2E1065, #4C1D95, #7C3AED)" },
  { tailwind: "from-[#E2E8F0] via-[#F8FAFC] to-[#FFFFFF]", css: "linear-gradient(to bottom right, #E2E8F0, #F8FAFC, #FFFFFF)" },
  
  // New Premium Gradients (Social Media)
  { tailwind: "from-[#581C87] via-[#9333EA] to-[#EC4899]", css: "linear-gradient(to bottom right, #581C87, #9333EA, #EC4899)" },
  { tailwind: "from-[#14532D] via-[#15803D] to-[#86EFAC]", css: "linear-gradient(to bottom right, #14532D, #15803D, #86EFAC)" },
  
  // New Premium Templates Gradients
  { tailwind: "from-[#020617] via-[#0F172A] to-[#1E293B]", css: "linear-gradient(to bottom right, #020617, #0F172A, #1E293B)" },
  { tailwind: "from-[#09090B] via-[#18181B] to-[#27272A]", css: "linear-gradient(to bottom right, #09090B, #18181B, #27272A)" },
  { tailwind: "from-[#172554] via-[#1D4ED8] to-[#38BDF8]", css: "linear-gradient(to bottom right, #172554, #1D4ED8, #38BDF8)" },
  { tailwind: "from-[#312E81] via-[#4338CA] to-[#818CF8]", css: "linear-gradient(to bottom right, #312E81, #4338CA, #818CF8)" },
  { tailwind: "from-[#7C2D12] via-[#EA580C] to-[#FDBA74]", css: "linear-gradient(to bottom right, #7C2D12, #EA580C, #FDBA74)" },
  { tailwind: "from-[#030712] via-[#111827] to-[#374151]", css: "linear-gradient(to bottom right, #030712, #111827, #374151)" },
  
  // New Mixed Social Gradients
  { tailwind: "from-[#581C87] via-[#9333EA] to-[#D946EF]", css: "linear-gradient(to bottom right, #581C87, #9333EA, #D946EF)" },
  { tailwind: "from-[#7F1D1D] via-[#DC2626] to-[#FB923C]", css: "linear-gradient(to bottom right, #7F1D1D, #DC2626, #FB923C)" },
  { tailwind: "from-[#172554] via-[#2563EB] to-[#60A5FA]", css: "linear-gradient(to bottom right, #172554, #2563EB, #60A5FA)" },
];

// Check if a gradient CSS uses rgba/hsla with alpha < 1 (needs a solid background)
export const gradientUsesAlpha = (css: string): boolean => {
  return /rgba\(|hsla\(/.test(css);
};

// App dark background color (matches hsl(222, 47%, 7%) from index.css)
export const APP_BG_DARK = "#0B0F19";

// Extract arrays for backward compatibility
export const gradients = gradientMap.map(g => g.tailwind);
export const gradientCSSMap = gradientMap.map(g => g.css);

export const solidColors = [
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
];

// Color hex mapping for Tailwind classes
export const colorHexMap: Record<string, string> = {
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

// Check if background is light or dark based on gradient/color selection
export const isLightBackground = (backgroundType: string, selectedGradient: number, selectedSolidColor: string | null): boolean => {
  if (backgroundType === "gradient") {
    // Light gradients are indices 16-19
    return selectedGradient >= 16;
  } else {
    // Light solid colors are at indices 21+ (bg-*-100)
    return selectedSolidColor?.includes("-100") ?? false;
  }
};
