// OG Image Templates
// All templates with default image size: 550x350

export const templates = [
  // Blog Templates
  {
    id: 0,
    name: "Blog with Hero Image",
    category: "Blog",
    gradient: "from-[#0F172A] via-[#111827] to-[#1E293B]",
    title: "The Future of React",
    subtitle: "Exploring new patterns and best practices",
    titleColor: "#FFFFFF",
    subtitleColor: "#E5E7EB",
    authorColor: "#9CA3AF",
    titleSize: 48,
    hasImage: true,
    hasLogo: true,
    hasAuthor: true,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: {
      x: 480,
      y: 90,
      width: 640,
      height: 430,
      rotation: -10,
      shadowBlur: 60,
      shadowSpread: 10,
      shadowColor: "#000000",
      shadowOpacity: 0.25,
    },

    logoPosition: {
      x: 70,
      y: 60,
      width: 72,
      height: 72,
    },
    contentPosition: {
      x: 60,
      y: 180,
      width: 380,
      textAlign: "left",
    },
    preview: {
      bg: "from-blue-600/30 to-cyan-500/20",
      text: "dark",
    },
  },
  {
    id: 1,
    name: "Minimal Blog",
    category: "Blog",
    gradient: "from-[#7C2D12] via-[#EA580C] to-[#FB923C]",
    title: "Your Amazing Blog Title",
    subtitle: "A compelling description that captures attention",
    titleColor: "#FFFFFF",
    subtitleColor: "#F3F4F6",
    authorColor: "#D1D5DB",
    titleSize: 56,
    hasImage: false,
    hasLogo: false,
    hasAuthor: true,
    imageUrl: "",
    logoUrl: "",
    imagePosition: undefined,
    logoPosition: undefined,
    contentPosition: {
      x: 200,
      y: 200,
      width: 1060,
      textAlign: "center",
    },
    preview: {
      bg: "from-red-500 to-orange-400",
      text: "white",
    },
  },
  {
    id: 2,
    name: "Blog with Hero Image",
    category: "Blog",
    gradient: "from-[#172554] via-[#1E3A8A] to-[#2563EB]",
    title: "The Future of React",
    subtitle: "Exploring new patterns and best practices",
    titleColor: "#FFFFFF",
    subtitleColor: "#E0E7FF",
    titleSize: 44,
    hasImage: true,
    hasLogo: true,
    hasAuthor: false,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: {
      x: 175,
      y: 300,
      width: 550,
      height: 330,
      rotation: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: "#000000",
      shadowOpacity: 0,
    },
    logoPosition: { x: 50, y: 50, width: 80, height: 80 },
    contentPosition: {
      x: 50,
      y: 60,
      width: 800,
      textAlign: "center",
    },
    preview: {
      bg: "from-blue-600/30 to-cyan-500/20",
      text: "dark",
    },
  },
  {
    id: 3,
    name: "Dark Tech Article",
    category: "Blog",
    gradient: "from-[#020617] via-[#111827] to-[#334155]",
    title: "Web Performance Optimization",
    subtitle: "Speed up your website with these proven techniques",
    titleColor: "#FFFFFF",
    subtitleColor: "#CBD5E1",
    titleSize: 52,
    hasImage: false,
    hasLogo: false,
    hasAuthor: false,
    imageUrl: "",
    logoUrl: "",
    imagePosition: undefined,
    logoPosition: undefined,
    contentPosition: {
      x: 200,
      y: 200,
      width: 1060,
      textAlign: "center",
    },
    preview: {
      bg: "from-slate-700 to-slate-500",
      text: "white",
    },
  },

  // SaaS Templates
  {
    id: 4,
    name: "SaaS Launch",
    category: "SaaS",
    gradient: "from-[#312E81] via-[#4338CA] to-[#6366F1]",
    title: "Introducing NextFlow",
    subtitle: "The faster way to build modern applications",
    titleColor: "#FFFFFF",
    subtitleColor: "#E0E7FF",
    titleSize: 56,
    hasImage: true,
    hasLogo: true,
    hasAuthor: false,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: {
      x: -100,
      y: 160,
      width: 550,
      height: 470,
      rotation: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: "#000000",
      shadowOpacity: 0,
    },
    logoPosition: { x: 40, y: 40, width: 100, height: 100 },
    contentPosition: {
      x: 480,
      y: 170,
      width: 470,
      textAlign: "left",
    },
    preview: {
      bg: "from-purple-600/30 to-blue-600/10",
      text: "dark",
    },
  },
  {
    id: 5,
    name: "Startup Pitch",
    category: "SaaS",
    gradient: "from-[#7C2D12] via-[#C2410C] to-[#FB7185]",
    title: "AI-Powered Analytics",
    subtitle: "Understand your data like never before",
    titleColor: "#FFFFFF",
    subtitleColor: "#F3E8FF",
    titleSize: 64,
    hasImage: true,
    hasLogo: true,
    hasAuthor: false,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: {
      x: 360,
      y: 250,
      width: 540,
      height: 470,
      rotation: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: "#000000",
      shadowOpacity: 0,
    },
    logoPosition: { x: 50, y: 50, width: 90, height: 90 },
    contentPosition: {
      x: 30,
      y: 90,
      width: 300,
      textAlign: "left",
    },
    preview: {
      bg: "from-orange-500/20 to-pink-600/10",
      text: "dark",
    },
  },
  {
    id: 6,
    name: "SaaS Minimalist",
    category: "SaaS",
    gradient: "from-[#083344] via-[#155E75] to-[#67E8F9]",
    title: "Simple. Powerful. Yours.",
    subtitle: "Enterprise-grade tool for everyone",
    titleColor: "#1F2937",
    subtitleColor: "#374151",
    titleSize: 54,
    hasImage: false,
    hasLogo: false,
    hasAuthor: false,
    imageUrl: "",
    logoUrl: "",
    imagePosition: undefined,
    logoPosition: undefined,
    contentPosition: {
      x: 200,
      y: 200,
      width: 1060,
      textAlign: "center",
    },
    preview: {
      bg: "from-cyan-300 to-blue-100",
      text: "dark",
    },
  },

  // Portfolio Templates
  {
    id: 7,
    name: "Creative Folio",
    category: "Portfolio",
    gradient: "from-[#4C1D95] via-[#7E22CE] to-[#DB2777]",
    title: "Creative Studio",
    subtitle: "Transforming ideas into reality",
    titleColor: "#FFFFFF",
    subtitleColor: "#F3E8FF",
    authorColor: "#D8B4FE",
    titleSize: 46,
    hasImage: true,
    hasLogo: true,
    hasAuthor: true,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: {
      x: 420,
      y: 90,
      width: 530,
      height: 420,
      rotation: -8,
      shadowBlur: 90,
      shadowSpread: 20,
      shadowColor: "#4F46E5",
      shadowOpacity: 0.35,
    },
    logoPosition: { x: 60, y: 60, width: 110, height: 110 },
    contentPosition: {
      x: 50,
      y: 130,
      width: 350,
      textAlign: "left",
    },
    preview: {
      bg: "from-pink-500/30 to-rose-500/20",
      text: "dark",
    },
  },
  {
    id: 8,
    name: "Portfolio Classic",
    category: "Portfolio",
    gradient: "from-[#064E3B] via-[#065F46] to-[#0F766E]",
    title: "John Designer",
    subtitle: "Award-winning design work",
    titleColor: "#FFFFFF",
    subtitleColor: "#D1FAE5",
    authorColor: "#6EE7B7",
    titleSize: 50,
    hasImage: false,
    hasLogo: false,
    hasAuthor: true,
    imageUrl: "",
    logoUrl: "",
    imagePosition: undefined,
    logoPosition: undefined,
    contentPosition: {
      x: 300,
      y: 200,
      width: 1060,
      textAlign: "center",
    },
    preview: {
      bg: "from-emerald-500/20 to-cyan-500/10",
      text: "dark",
    },
  },

  // Product Launch Templates
  {
    id: 9,
    name: "Product Hero",
    category: "Product Launch",
    gradient: "from-[#2E1065] via-[#4C1D95] to-[#7C3AED]",
    title: "Introducing CloudSync Pro",
    subtitle: "Sync. Collaborate. Thrive.",
    titleColor: "#FFFFFF",
    subtitleColor: "#E9D5FF",
    titleSize: 48,
    hasImage: true,
    hasLogo: true,
    hasAuthor: false,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: {
      x: -100,
      y: 160,
      width: 550,
      height: 470,
      rotation: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: "#000000",
      shadowOpacity: 0,
    },
    logoPosition: { x: 45, y: 45, width: 95, height: 95 },
    contentPosition: {
      x: 490,
      y: 200,
      width: 380,
      textAlign: "left",
    },
    preview: {
      bg: "from-violet-600/30 to-indigo-600/20",
      text: "light",
    },
  },
  {
    id: 10,
    name: "Launch Day Bold",
    category: "Product Launch",
    gradient: "from-[#7F1D1D] via-[#DC2626] to-[#F97316]",
    title: "Breaking News: SuperApp v2",
    subtitle: "Faster, smarter, more powerful",
    titleColor: "#FFFFFF",
    subtitleColor: "#FEE2E2",
    titleSize: 52,
    hasImage: true,
    hasLogo: true,
    hasAuthor: false,
    imageUrl: "/ogImage.png",
    logoUrl: undefined,
    imagePosition: {
      x: 370,
      y: 160,
      width: 530,
      height: 470,
      rotation: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: "#000000",
      shadowOpacity: 0,
    },
    logoPosition: { x: 55, y: 55, width: 85, height: 85 },
    contentPosition: {
      x: 30,
      y: 110,
      width: 320,
      textAlign: "left",
    },
    preview: {
      bg: "from-red-500 to-pink-500",
      text: "white",
    },
  },
  {
    id: 11,
    name: "Launch Minimal",
    category: "Product Launch",
    gradient: "from-[#E2E8F0] via-[#F8FAFC] to-[#FFFFFF]",
    title: "New Era Begins",
    subtitle: "What happens next will change everything",
    titleColor: "#1F2937",
    subtitleColor: "#4B5563",
    titleSize: 56,
    hasImage: false,
    hasLogo: false,
    hasAuthor: false,
    imageUrl: "",
    logoUrl: "",
    imagePosition: undefined,
    logoPosition: undefined,
    contentPosition: {
      x: 250,
      y: 200,
      width: 1060,
      textAlign: "center",
    },
    preview: {
      bg: "from-gray-100 to-white",
      text: "dark",
    },
  },

  // Social Media Templates
  {
    id: 12,
    name: "Social Media Vibes",
    category: "Social Media",
    gradient: "from-[#78350F] via-[#EA580C] to-[#FDBA74]",
    title: "Check Out My Latest Post!",
    subtitle: "Join the conversation",
    titleColor: "#FFFFFF",
    subtitleColor: "#FEF3C7",
    titleSize: 44,
    hasImage: true,
    hasLogo: false,
    hasAuthor: false,
    imageUrl: "/ogImage.png",
    logoUrl: "",
    imagePosition: {
      x: 370,
      y: 120,
      width: 500,
      height: 430,
      rotation: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: "#000000",
      shadowOpacity: 0,
    },
    logoPosition: undefined,
    contentPosition: {
      x: 25,
      y: 180,
      width: 320,
      textAlign: "left",
    },
    preview: {
      bg: "from-yellow-100/40 to-orange-100/20",
      text: "dark",
    },
  },
  {
    id: 13,
    name: "Social Engagement",
    category: "Social Media",
    gradient: "from-[#581C87] via-[#9333EA] to-[#EC4899]",
    title: "Go Follow Us!",
    subtitle: "Amazing content coming soon",
    titleColor: "#FFFFFF",
    subtitleColor: "#F3E8FF",
    titleSize: 46,
    hasImage: true,
    hasLogo: true,
    hasAuthor: false,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: {
      x: 500,
      y: 90,
      width: 480,
      height: 450,
      rotation: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: "#000000",
      shadowOpacity: 0,
    },
    logoPosition: { x: 70, y: 60, width: 72, height: 72 },
    contentPosition: {
      x: 50,
      y: 180,
      width: 410,
      textAlign: "left",
    },
    preview: {
      bg: "from-purple-400 to-pink-400",
      text: "white",
    },
  },
  {
    id: 14,
    name: "Social Minimal",
    category: "Social Media",
    gradient: "from-[#14532D] via-[#15803D] to-[#86EFAC]",
    title: "New Tutorial Live",
    subtitle: "Learn something new today",
    titleColor: "#1F2937",
    subtitleColor: "#374151",
    titleSize: 48,
    hasImage: false,
    hasLogo: false,
    hasAuthor: false,
    imageUrl: "/ogImage.png",
    logoUrl: "",
    imagePosition:{
        x: 425,
      y: 200,
      width: 400,
      height: 240,
      rotation: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: "#000000",
      shadowOpacity: 0,
    },
    logoPosition: undefined,
    contentPosition: {
      x: 70,
      y: 200,
      width: 1060,
      textAlign: "center",
    },
    preview: {
      bg: "from-green-100 to-green-50",
      text: "dark",
    },
  },
  // NEW PREMIUM TEMPLATES

  {
    id: 15,
    name: "Editorial Left Hero",
    category: "Blog",
    gradient: "from-[#020617] via-[#0F172A] to-[#1E293B]",
    title: "Design Systems That Scale",
    subtitle: "Building modern interfaces with consistency",
    titleColor: "#FFFFFF",
    subtitleColor: "#E5E7EB",
    authorColor: "#9CA3AF",
    titleSize: 50,
    hasImage: true,
    hasLogo: true,
    hasAuthor: true,
    imageUrl: "/ogImage.png",
    logoUrl: "",
    // LEFT FOCUS
    imagePosition: {
      x: -120,
      y: 90,
      width: 600,
      height: 430,
      rotation: 8,

      shadowBlur: 80,
      shadowSpread: 20,
      shadowColor: "#000000",
      shadowOpacity: 0.35,
    },

    logoPosition: {
      x: 850,
      y: 60,
      width: 72,
      height: 72,
    },

    contentPosition: {
      x: 520,
      y: 190,
      width: 350,
      textAlign: "left",
    },

    preview: {
      bg: "from-[#0F172A] via-[#111827] to-[#1E293B]",
      text: "white",
    },
  },

  {
    id: 16,
    name: "Centered Product Reveal",
    category: "Product Launch",
    gradient: "from-[#09090B] via-[#18181B] to-[#27272A]",
    title: "Meet Nova AI",
    subtitle: "Your next-gen productivity assistant",
    titleColor: "#FFFFFF",
    subtitleColor: "#E5E7EB",
    titleSize: 52,
    hasImage: true,
    hasLogo: true,
    hasAuthor: false,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",

    // LEFT TEXT + RIGHT IMAGE
    imagePosition: {
      x: 480,
      y: 120,
      width: 480,
      height: 420,
      rotation: -4,

      shadowBlur: 100,
      shadowSpread: 25,
      shadowColor: "#A855F7",
      shadowOpacity: 0.35,
    },

    logoPosition: {
      x: 40,
      y: 40,
      width: 74,
      height: 74,
    },

    contentPosition: {
      x: 40,
      y: 180,
      width: 400,
      textAlign: "left",
    },

    preview: {
      bg: "from-[#18181B] via-[#27272A] to-[#09090B]",
      text: "white",
    },
  },

  {
    id: 17,
    name: "Portfolio Showcase Left",
    category: "Portfolio",
    gradient: "from-[#172554] via-[#1D4ED8] to-[#38BDF8]",
    title: "Crafting Digital Experiences",
    subtitle: "Interactive products with modern aesthetics",
    titleColor: "#FFFFFF",
    subtitleColor: "#DBEAFE",
    authorColor: "#93C5FD",
    titleSize: 48,
    hasImage: true,
    hasLogo: true,
    hasAuthor: true,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",

    imagePosition: {
      x: -80,
      y: 150,
      width: 560,
      height: 340,
      rotation: 0,

      shadowBlur: 90,
      shadowSpread: 18,
      shadowColor: "#2563EB",
      shadowOpacity: 0.28,
    },

    logoPosition: {
      x: 830,
      y: 60,
      width: 82,
      height: 82,
    },

    contentPosition: {
      x: 510,
      y: 150,
      width: 360,
      textAlign: "left",
    },

    preview: {
      bg: "from-[#172554] via-[#1E3A8A] to-[#1D4ED8]",
      text: "white",
    },
  },

  {
    id: 20,
    name: "Cinematic Launch",
    category: "Product Launch",
    gradient: "from-[#030712] via-[#111827] to-[#374151]",
    title: "The Future Starts Today",
    subtitle: "Reimagining the way teams build products",
    titleColor: "#FFFFFF",
    subtitleColor: "#D1D5DB",
    titleSize: 54,
    hasImage: true,
    hasLogo: true,
    hasAuthor: false,
    imageUrl: "/ogImage.png",
    logoUrl: "",

    // MASSIVE LEFT BLEED
    imagePosition: {
      x: -180,
      y: 40,
      width: 720,
      height: 520,
      rotation: 10,

      shadowBlur: 130,
      shadowSpread: 30,
      shadowColor: "#000000",
      shadowOpacity: 0.45,
    },

    logoPosition: {
      x: 800,
      y: 60,
      width: 70,
      height: 70,
    },

    contentPosition: {
      x: 560,
      y: 200,
      width: 310,
      textAlign: "left",
    },

    preview: {
      bg: "from-[#111827] via-[#1F2937] to-[#374151]",
      text: "white",
    },
  },
  // MIXED SOCIAL MEDIA TEMPLATES
  // includes both image + non-image layouts

  {
    id: 26,
    name: "Minimal Quote Post",
    category: "Social Media",

    gradient: "from-[#020617] via-[#111827] to-[#334155]",

    title: "Consistency beats motivation.",
    subtitle: "Small improvements compound faster than hype.",
    titleColor: "#FFFFFF",
    subtitleColor: "#CBD5E1",
    authorColor: "#94A3B8",
    titleSize: 52,

    hasImage: false,
    hasLogo: false,
    hasAuthor: true,

    imageUrl: "",
    logoUrl: "",

    imagePosition: undefined,
    logoPosition: undefined,
    contentPosition: {
      x: 200,
      y: 200,
      width: 1060,
      textAlign: "center",
    },

    preview: {
      bg: "from-[#0F172A] via-[#111827] to-[#1E293B]",
      text: "white",
    },
  },

  {
    id: 29,
    name: "Viral Product Post",
    category: "Social Media",

    gradient: "from-[#7F1D1D] via-[#DC2626] to-[#FB923C]",

    title: "We Just Shipped v2 🚀",
    subtitle: "Faster performance. Cleaner UI. Better workflows.",
    titleColor: "#FFFFFF",
    subtitleColor: "#FEE2E2",
    titleSize: 48,

    hasImage: true,
    hasLogo: false,
    hasAuthor: false,

    imageUrl: "/ogImage.png",
    logoUrl: "",

    // LEFT BLEED
    imagePosition: {
      x: -90,
      y: 100,
      width: 580,
      height: 380,

      rotation: 7,

      shadowBlur: 120,
      shadowSpread: 30,
      shadowColor: "#DC2626",
      shadowOpacity: 0.42,
    },

    logoPosition: undefined,

    contentPosition: {
      x: 510,
      y: 200,
      width: 360,
      textAlign: "left",
    },

    preview: {
      bg: "from-[#7F1D1D] via-[#DC2626] to-[#F97316]",
      text: "white",
    },
  },

  {
    id: 30,
    name: "Twitter Style Text Card",
    category: "Social Media",

    gradient: "from-[#030712] via-[#111827] to-[#374151]",

    title: "Hot take:",
    subtitle:
      "Most SaaS products don't fail because of code. They fail because nobody cares.",
    titleColor: "#FFFFFF",
    subtitleColor: "#D1D5DB",
    authorColor: "#9CA3AF",
    titleSize: 44,

    hasImage: false,
    hasLogo: true,
    hasAuthor: true,

    imageUrl: "",
    logoUrl: "/ogImage.png",

    imagePosition: undefined,

    logoPosition: {
      x: 80,
      y: 60,
      width: 68,
      height: 68,
    },
    contentPosition: {
      x: 100,
      y: 200,
      width: 1060,
      textAlign: "center",
    },

    preview: {
      bg: "from-[#111827] via-[#1F2937] to-[#374151]",
      text: "white",
    },
  },

] as const;

export const categories = [
  "All",
  "Blog",
  "SaaS",
  "Portfolio",
  "Product Launch",
  "Social Media",
] as const;

// Get template by ID
export const getTemplateById = (id: number) => {
  return templates.find((t) => t.id === id);
};

// Get templates by category
export const getTemplatesByCategory = (category: string) => {
  if (category === "All") return templates;
  return templates.filter((t) => t.category === category);
};

// Search templates
export const searchTemplates = (query: string) => {
  const q = query.toLowerCase();
  return templates.filter((t) => t.name.toLowerCase().includes(q));
};
