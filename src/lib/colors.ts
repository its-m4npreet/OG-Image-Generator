// Unified gradient mapping - Tailwind class to CSS gradient
export const gradientMap = [
  { tailwind: "from-primary/30 to-secondary/10", css: "linear-gradient(to bottom right, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.1))" },
  { tailwind: "from-primary/40 to-primary/5", css: "linear-gradient(to bottom right, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.05))" },
  { tailwind: "from-secondary/20 to-primary/10", css: "linear-gradient(to bottom right, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.1))" },
  { tailwind: "from-primary/20 via-card to-secondary/20", css: "linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgb(24, 24, 27), rgba(147, 51, 234, 0.2))" },
  { tailwind: "from-purple-600/30 to-blue-600/10", css: "linear-gradient(to bottom right, rgba(147, 112, 219, 0.3), rgba(37, 99, 235, 0.1))" },
  { tailwind: "from-orange-500/20 to-pink-600/10", css: "linear-gradient(to bottom right, rgba(249, 115, 22, 0.2), rgba(233, 64, 87, 0.1))" },
  { tailwind: "from-emerald-500/20 to-cyan-500/10", css: "linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(34, 197, 94, 0.1))" },
  { tailwind: "from-rose-500/20 to-amber-500/10", css: "linear-gradient(to bottom right, rgba(244, 63, 94, 0.2), rgba(251, 146, 60, 0.1))" },
  { tailwind: "from-blue-600/30 to-cyan-500/20", css: "linear-gradient(to bottom right, rgba(37, 99, 235, 0.3), rgba(34, 197, 94, 0.2))" },
  { tailwind: "from-indigo-600/30 to-purple-500/20", css: "linear-gradient(to bottom right, rgba(79, 70, 229, 0.3), rgba(126, 34, 206, 0.2))" },
  { tailwind: "from-pink-500/30 to-rose-500/20", css: "linear-gradient(to bottom right, rgba(236, 72, 153, 0.3), rgba(244, 63, 94, 0.2))" },
  { tailwind: "from-amber-500/30 to-orange-500/20", css: "linear-gradient(to bottom right, rgba(251, 146, 60, 0.3), rgba(249, 115, 22, 0.2))" },
  { tailwind: "from-green-500/30 to-emerald-500/20", css: "linear-gradient(to bottom right, rgba(34, 197, 94, 0.3), rgba(16, 185, 129, 0.2))" },
  { tailwind: "from-teal-500/30 to-cyan-500/20", css: "linear-gradient(to bottom right, rgba(20, 184, 166, 0.3), rgba(34, 211, 238, 0.2))" },
  { tailwind: "from-violet-600/30 to-indigo-600/20", css: "linear-gradient(to bottom right, rgba(109, 40, 217, 0.3), rgba(79, 70, 229, 0.2))" },
  { tailwind: "from-fuchsia-600/30 to-pink-500/20", css: "linear-gradient(to bottom right, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.2))" },
  // Light gradients
  { tailwind: "from-purple-200/40 to-pink-100/20", css: "linear-gradient(to bottom right, rgba(216, 180, 254, 0.4), rgba(251, 228, 228, 0.2))" },
  { tailwind: "from-blue-100/40 to-cyan-100/20", css: "linear-gradient(to bottom right, rgba(219, 234, 254, 0.4), rgba(206, 250, 254, 0.2))" },
  { tailwind: "from-yellow-100/40 to-orange-100/20", css: "linear-gradient(to bottom right, rgba(254, 243, 199, 0.4), rgba(254, 227, 198, 0.2))" },
  { tailwind: "from-green-100/40 to-emerald-100/20", css: "linear-gradient(to bottom right, rgba(220, 252, 231, 0.4), rgba(209, 250, 229, 0.2))" },
  // Premium modern gradients
  { tailwind: "from-red-500 to-orange-400", css: "linear-gradient(to bottom right, #ef4444, #fb923c)" },
  { tailwind: "from-orange-500 to-amber-400", css: "linear-gradient(to bottom right, #f97316, #fbbf24)" },
  { tailwind: "from-pink-500 to-rose-400", css: "linear-gradient(to bottom right, #ec4899, #f43f5e)" },
  { tailwind: "from-pink-400 to-red-300", css: "linear-gradient(to bottom right, #ec4899, #fca5a5)" },
  { tailwind: "from-rose-400 to-pink-200", css: "linear-gradient(to bottom right, #f43f5e, #fbcfe8)" },
  { tailwind: "from-orange-300 to-yellow-200", css: "linear-gradient(to bottom right, #fdba74, #fef08a)" },
  { tailwind: "from-yellow-200 to-orange-100", css: "linear-gradient(to bottom right, #fbbf24, #fef3c7)" },
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
  { tailwind: "from-lime-500 to-green-400", css: "linear-gradient(to bottom right, #84cc16, #22c55e)" },
  { tailwind: "from-teal-500 to-cyan-300", css: "linear-gradient(to bottom right, #14b8a6, #67e8f9)" },
  { tailwind: "from-cyan-400 to-green-300", css: "linear-gradient(to bottom right, #06b6d4, #86efac)" },
  { tailwind: "from-slate-700 to-slate-500", css: "linear-gradient(to bottom right, #475569, #64748b)" },
  { tailwind: "from-gray-700 to-gray-500", css: "linear-gradient(to bottom right, #525252, #737373)" },
  { tailwind: "from-neutral-600 to-neutral-400", css: "linear-gradient(to bottom right, #6b7280, #9ca3af)" },
  // Additional gradients from templates
  { tailwind: "from-red-500 to-pink-500", css: "linear-gradient(to bottom right, #ef4444, #ec4899)" },
  { tailwind: "from-purple-400 to-pink-400", css: "linear-gradient(to bottom right, #a78bfa, #f472b6)" },
  { tailwind: "from-gray-100 to-white", css: "linear-gradient(to bottom right, #f3f4f6, #ffffff)" },
  { tailwind: "from-green-100 to-green-50", css: "linear-gradient(to bottom right, #dcfce7, #f0fdf4)" },
];

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
