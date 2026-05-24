// Premium OG Studio color system
// Curated for Open Graph cards: stronger contrast, fewer random pairs,
// richer dark surfaces, cleaner light palettes, and brand-safe accents.

export type GradientMood =
  | "dark"
  | "editorial"
  | "saas"
  | "creator"
  | "launch"
  | "minimal"
  | "fresh";

export type GradientPreset = {
  name: string;
  mood: GradientMood;
  tailwind: string;
  css: string;
  text: "light" | "dark";
  accent: string;
};

// Main premium gradients.
// Keep this list curated. More options is not always better for OG cards.
export const gradientMap: GradientPreset[] = [
  {
    name: "Midnight Graphite",
    mood: "dark",
    tailwind: "from-[#030712] via-[#111827] to-[#334155]",
    css: "linear-gradient(135deg, #030712 0%, #111827 48%, #334155 100%)",
    text: "light",
    accent: "#94A3B8",
  },
  {
    name: "Obsidian Blue",
    mood: "dark",
    tailwind: "from-[#020617] via-[#0F172A] to-[#1D4ED8]",
    css: "linear-gradient(135deg, #020617 0%, #0F172A 56%, #1D4ED8 100%)",
    text: "light",
    accent: "#60A5FA",
  },
  {
    name: "Carbon Violet",
    mood: "dark",
    tailwind: "from-[#09090B] via-[#18181B] to-[#4C1D95]",
    css: "linear-gradient(135deg, #09090B 0%, #18181B 54%, #4C1D95 100%)",
    text: "light",
    accent: "#A78BFA",
  },
  {
    name: "Deep Space",
    mood: "dark",
    tailwind: "from-[#020617] via-[#172554] to-[#312E81]",
    css: "linear-gradient(135deg, #020617 0%, #172554 52%, #312E81 100%)",
    text: "light",
    accent: "#818CF8",
  },
  {
    name: "Premium Slate",
    mood: "minimal",
    tailwind: "from-[#0F172A] via-[#1E293B] to-[#475569]",
    css: "linear-gradient(135deg, #0F172A 0%, #1E293B 52%, #475569 100%)",
    text: "light",
    accent: "#CBD5E1",
  },
  {
    name: "SaaS Indigo",
    mood: "saas",
    tailwind: "from-[#312E81] via-[#4338CA] to-[#818CF8]",
    css: "linear-gradient(135deg, #312E81 0%, #4338CA 50%, #818CF8 100%)",
    text: "light",
    accent: "#C7D2FE",
  },
  {
    name: "Electric Azure",
    mood: "saas",
    tailwind: "from-[#172554] via-[#2563EB] to-[#38BDF8]",
    css: "linear-gradient(135deg, #172554 0%, #2563EB 52%, #38BDF8 100%)",
    text: "light",
    accent: "#BAE6FD",
  },
  {
    name: "Cyber Cyan",
    mood: "saas",
    tailwind: "from-[#083344] via-[#155E75] to-[#67E8F9]",
    css: "linear-gradient(135deg, #083344 0%, #155E75 52%, #67E8F9 100%)",
    text: "light",
    accent: "#A5F3FC",
  },
  {
    name: "Aurora Product",
    mood: "launch",
    tailwind: "from-[#2E1065] via-[#7C3AED] to-[#EC4899]",
    css: "linear-gradient(135deg, #2E1065 0%, #7C3AED 50%, #EC4899 100%)",
    text: "light",
    accent: "#F9A8D4",
  },
  {
    name: "Violet Founder",
    mood: "creator",
    tailwind: "from-[#4C1D95] via-[#7E22CE] to-[#DB2777]",
    css: "linear-gradient(135deg, #4C1D95 0%, #7E22CE 52%, #DB2777 100%)",
    text: "light",
    accent: "#F0ABFC",
  },
  {
    name: "Warm Launch",
    mood: "launch",
    tailwind: "from-[#7F1D1D] via-[#DC2626] to-[#FB923C]",
    css: "linear-gradient(135deg, #7F1D1D 0%, #DC2626 50%, #FB923C 100%)",
    text: "light",
    accent: "#FDBA74",
  },
  {
    name: "Editorial Amber",
    mood: "editorial",
    tailwind: "from-[#78350F] via-[#EA580C] to-[#FDBA74]",
    css: "linear-gradient(135deg, #78350F 0%, #EA580C 52%, #FDBA74 100%)",
    text: "light",
    accent: "#FED7AA",
  },
  {
    name: "Evergreen Tech",
    mood: "fresh",
    tailwind: "from-[#064E3B] via-[#047857] to-[#2DD4BF]",
    css: "linear-gradient(135deg, #064E3B 0%, #047857 52%, #2DD4BF 100%)",
    text: "light",
    accent: "#99F6E4",
  },
  {
    name: "Signal Green",
    mood: "fresh",
    tailwind: "from-[#14532D] via-[#15803D] to-[#86EFAC]",
    css: "linear-gradient(135deg, #14532D 0%, #15803D 52%, #86EFAC 100%)",
    text: "light",
    accent: "#BBF7D0",
  },
  {
    name: "Studio Paper",
    mood: "minimal",
    tailwind: "from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]",
    css: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 52%, #E2E8F0 100%)",
    text: "dark",
    accent: "#475569",
  },
  {
    name: "Warm Paper",
    mood: "editorial",
    tailwind: "from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA]",
    css: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 52%, #FED7AA 100%)",
    text: "dark",
    accent: "#C2410C",
  },
  {
    name: "Soft Lilac",
    mood: "creator",
    tailwind: "from-[#FAF5FF] via-[#F3E8FF] to-[#E9D5FF]",
    css: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 52%, #E9D5FF 100%)",
    text: "dark",
    accent: "#7E22CE",
  },
  {
    name: "Ice Blue",
    mood: "saas",
    tailwind: "from-[#EFF6FF] via-[#DBEAFE] to-[#BAE6FD]",
    css: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 52%, #BAE6FD 100%)",
    text: "dark",
    accent: "#1D4ED8",
  },
];

// Backward compatibility with your existing code.
export const gradients = gradientMap.map((g) => g.tailwind);
export const gradientCSSMap = gradientMap.map((g) => g.css);

// Curated solid backgrounds. These feel more premium than random 700/100 shades.
export const solidColors = [
  "bg-[#020617]",
  "bg-[#030712]",
  "bg-[#09090B]",
  "bg-[#0F172A]",
  "bg-[#111827]",
  "bg-[#18181B]",
  "bg-[#1E293B]",
  "bg-[#312E81]",
  "bg-[#172554]",
  "bg-[#064E3B]",
  "bg-[#7F1D1D]",
  "bg-[#78350F]",
  "bg-[#F8FAFC]",
  "bg-[#F1F5F9]",
  "bg-[#FFF7ED]",
  "bg-[#FAF5FF]",
  "bg-[#EFF6FF]",
  "bg-[#ECFDF5]",
];

export const colorHexMap: Record<string, string> = {
  "bg-[#020617]": "#020617",
  "bg-[#030712]": "#030712",
  "bg-[#09090B]": "#09090B",
  "bg-[#0F172A]": "#0F172A",
  "bg-[#111827]": "#111827",
  "bg-[#18181B]": "#18181B",
  "bg-[#1E293B]": "#1E293B",
  "bg-[#312E81]": "#312E81",
  "bg-[#172554]": "#172554",
  "bg-[#064E3B]": "#064E3B",
  "bg-[#7F1D1D]": "#7F1D1D",
  "bg-[#78350F]": "#78350F",
  "bg-[#F8FAFC]": "#F8FAFC",
  "bg-[#F1F5F9]": "#F1F5F9",
  "bg-[#FFF7ED]": "#FFF7ED",
  "bg-[#FAF5FF]": "#FAF5FF",
  "bg-[#EFF6FF]": "#EFF6FF",
  "bg-[#ECFDF5]": "#ECFDF5",

  // Legacy support in case old saved templates still use these.
  "bg-slate-700": "#334155",
  "bg-gray-800": "#1F2937",
  "bg-zinc-800": "#27272A",
  "bg-neutral-800": "#262626",
  "bg-stone-800": "#292524",
  "bg-red-700": "#B91C1C",
  "bg-orange-700": "#C2410C",
  "bg-amber-700": "#B45309",
  "bg-yellow-700": "#A16207",
  "bg-lime-700": "#4D7C0F",
  "bg-green-700": "#15803D",
  "bg-emerald-700": "#047857",
  "bg-teal-700": "#0F766E",
  "bg-cyan-700": "#0E7490",
  "bg-blue-700": "#1D4ED8",
  "bg-indigo-700": "#4338CA",
  "bg-violet-700": "#6D28D9",
  "bg-purple-700": "#7E22CE",
  "bg-fuchsia-700": "#A21CAF",
  "bg-pink-700": "#BE185D",
  "bg-rose-700": "#BE123C",
  "bg-slate-100": "#F1F5F9",
  "bg-gray-100": "#F3F4F6",
  "bg-red-100": "#FEE2E2",
  "bg-orange-100": "#FFEDD5",
  "bg-amber-100": "#FEF3C7",
  "bg-yellow-100": "#FEF9C3",
  "bg-lime-100": "#ECFCCB",
  "bg-green-100": "#DCFCE7",
  "bg-emerald-100": "#D1FAE5",
  "bg-teal-100": "#CCFBF1",
  "bg-cyan-100": "#CFFAFE",
  "bg-blue-100": "#DBEAFE",
  "bg-indigo-100": "#E0E7FF",
  "bg-violet-100": "#EDE9FE",
  "bg-purple-100": "#F3E8FF",
  "bg-pink-100": "#FCE7F3",
  "bg-rose-100": "#FFE4E6",
};

export const isLightColor = (hexColor: string): boolean => {
  if (!hexColor || !hexColor.startsWith("#")) return false;

  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) return false;

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Relative luminance with sRGB correction.
  const toLinear = (value: number) =>
    value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return luminance > 0.55;
};

export const getNoiseSVG = (noiseLevel: number, bgColor?: string): string => {
  if (noiseLevel <= 0) return "";

  const safeNoiseLevel = Math.max(0, Math.min(noiseLevel, 100));
  const isLight = bgColor ? isLightColor(bgColor) : false;

  // Premium OG cards need subtle texture, not dirty grain.
  const noiseColor = isLight ? "%230F172A" : "%23FFFFFF";
  const noiseOpacity = isLight
    ? Math.min((safeNoiseLevel / 100) * 0.14, 0.14)
    : Math.min((safeNoiseLevel / 100) * 0.18, 0.18);

  return `url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' seed='8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' fill='${noiseColor}' opacity='${noiseOpacity}' filter='url(%23n)'/%3E%3C/svg%3E")`;
};

export const isLightBackground = (
  backgroundType: string,
  selectedGradient: number,
  selectedSolidColor: string | null
): boolean => {
  if (backgroundType === "gradient") {
    return gradientMap[selectedGradient]?.text === "dark";
  }

  if (!selectedSolidColor) return false;

  const hex = colorHexMap[selectedSolidColor];
  return hex ? isLightColor(hex) : selectedSolidColor.includes("-100");
};

export const getReadableTextColor = (
  backgroundType: string,
  selectedGradient: number,
  selectedSolidColor: string | null
): string => {
  return isLightBackground(backgroundType, selectedGradient, selectedSolidColor)
    ? "#0F172A"
    : "#F8FAFC";
};

export const getMutedTextColor = (
  backgroundType: string,
  selectedGradient: number,
  selectedSolidColor: string | null
): string => {
  return isLightBackground(backgroundType, selectedGradient, selectedSolidColor)
    ? "#475569"
    : "#CBD5E1";
};

export const getAccentColor = (
  backgroundType: string,
  selectedGradient: number,
  selectedSolidColor: string | null
): string => {
  if (backgroundType === "gradient") {
    return gradientMap[selectedGradient]?.accent ?? "#60A5FA";
  }

  const hex = selectedSolidColor ? colorHexMap[selectedSolidColor] : undefined;
  return hex && isLightColor(hex) ? "#2563EB" : "#93C5FD";
};
