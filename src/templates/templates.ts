// OG Image Templates
// All templates with default image size: 550x350

export const templates = [
  // Blog Templates
  {
    id: 0,
    name: "Blog with Hero Image",
    category: "Blog",
    tag: "",
    istag: false,
    gradient: "from-[#020617] via-[#111827] to-[#334155]",
    title: "The Future of React",
    subtitle: "Exploring new patterns and best practices",
    titleColor: "#FFFFFF",
    subtitleColor: "#E5E7EB",
    authorColor: "#9CA3AF",
    titleSize: 48,
    hasImage: true,
    hasLogo: true,
    hasAuthor: true,
    ismultiple: false,
    imageUrl: "/ogImage.png",
    logoUrl: "",
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
      x: 60,
      y: 120,
      width: 50,
      height: 50,
    },
    contentPosition: {
      x: 60,
      y: 210,
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
    name: "Editorial Left Hero",
    category: "Blog",
    tag: "",
    istag: false,
    gradient: "radial-teal-glow",
    title: "Design Systems That Scale",
    subtitle: "Building modern interfaces with consistency",
    titleColor: "#1C1C1C",
    subtitleColor: "#171717",
    authorColor: "#121416",
    titleSize: 50,
    hasImage: true,
    hasLogo: true,
    hasAuthor: true,
    ismultiple: false,
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
      x: 520,
      y: 100,
      width: 60,
      height: 60,
    },

    contentPosition: {
      x: 520,
      y: 220,
      width: 350,
      textAlign: "left",
    },

    preview: {
      bg: "radial-teal-glow",
      text: "white",
    },
  },
  {
    id: 2,
    name: "Cinematic Launch",
    category: "Product Launch",
    tag: "",
    istag: false,
    gradient: "from-[#030712] via-[#111827] to-[#374151]",
    pattern: 4,
    title: "The Future Starts Today",
    subtitle: "Reimagining the way teams build products",
    titleColor: "#1F2937",
    subtitleColor: "#4B5563",
    titleSize: 54,
    hasImage: true,
    hasLogo: true,
    hasAuthor: false,
    ismultiple: false,
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
      x: 560,
      y: 80,
      width: 65,
      height: 65,
    },

    contentPosition: {
      x: 560,
      y: 230,
      width: 310,
      textAlign: "left",
    },

    preview: {
      bg: "cross-top-fade",
      text: "dark",
    },
  },
  // MIXED SOCIAL MEDIA TEMPLATES
  // includes both image + non-image layouts

  {
    id: 3,
    name: "Minimal Quote Post",
    category: "Social Media",
    tag: "",
    istag: false,

    gradient: "from-[#020617] via-[#111827] to-[#334155]",
    pattern: 11,

    title: "Consistency beats motivation.",
    subtitle: "Small improvements compound faster than hype.",
    titleColor: "#FFFFFF",
    subtitleColor: "#CBD5E1",
    authorColor: "#94A3B8",
    titleSize: 52,

    hasImage: false,
    hasLogo: false,
    hasAuthor: true,
    ismultiple: false,

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
      bg: "variable-spacing",
      text: "white",
    },
  },
  {
    id: 4,
    name: "Dark Tech Article",
    category: "Blog",
    tag: "",
    istag: false,
    gradient: "aurora-dream-vivid-bloom",
    title: "Web Performance Optimization",
    subtitle: "Speed up your website with these proven techniques",
    titleColor: "#000000",
    subtitleColor: "#1F2937",
    titleSize: 52,
    hasImage: false,
    hasLogo: false,
    hasAuthor: false,
    ismultiple: false,
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
      bg: "aurora-dream-vivid-bloom",
      text: "dark",
    },
  },

  // SaaS Templates
  {
    id: 5,
    name: "SaaS Launch",
    category: "SaaS",
    tag: "",
    istag: false,
    gradient: "aurora-dream-diagonal-flow",
    title: "Introducing NextFlow",
    subtitle: "The faster way to build modern applications",
    titleColor: "#000000",
    subtitleColor: "#0A0A0A",
    titleSize: 56,
    hasImage: true,
    hasLogo: true,
    hasAuthor: false,
    ismultiple: false,
    imageUrl: "/ogImage.png",
    logoUrl: "",
    imagePosition: {
      x: 181,
      y: 300,
      width: 550,
      height: 470,
      rotation: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: "#000000",
      shadowOpacity: 0,
    },
    logoPosition: {
      x: 490,
      y: 90,
      width: 55,
      height: 55,
    },
    contentPosition: {
      x: 252,
      y: 62,
      width: 600,
      textAlign: "left",
    },
    preview: {
      bg: "from-purple-600/30 to-blue-600/10",
      text: "dark",
    },
  },
  {
    id: 6,
    name: "Startup Pitch",
    category: "SaaS",
    tag: "Ai",
    istag: true,
    gradient: "dreamy-sunset-gradient",
    title: "AI-Powered Analytics",
    subtitle: "Understand your data like never before",
    titleColor: "#FFFFFF",
    subtitleColor: "#F3E8FF",
    titleSize: 64,
    hasImage: true,
    hasLogo: true,
    hasAuthor: true,
    ismultiple: false,
    imageUrl: "/ogImage.png",
    logoUrl: "",
    imagePosition: {
      x: 538,
      y: 122,
      width: 300,
      height: 400,
      rotation: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: "#000000",
      shadowOpacity: 0,
    },
    tagPosition: {
      x: 55,
      y: 148,
      borderWidth: 1,
      borderColor: "#f0f0f0ff",
      borderRadius: 5,
    },
    logoPosition: {
      x: 30,
      y: 40,
      width: 55,
      height: 55,
    },
    contentPosition: {
      x: 23,
      y: 158,
      width: 445,
      textAlign: "left",
    },
    preview: {
      bg: "from-orange-500/20 to-pink-600/10",
      text: "dark",
    },
  },
  {
    id: 7,
    name: "SaaS Minimalist",
    category: "SaaS",
    tag: "",
    istag: false,
    gradient: "pearl-mist",
    title: "Simple. Powerful. Yours.",
    subtitle: "Enterprise-grade tool for everyone",
    titleColor: "#BDC7D6",
    subtitleColor: "#B6B9BE",
    titleSize: 54,
    hasImage: false,
    hasLogo: false,
    hasAuthor: false,
    ismultiple: false,
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
      bg: "pearl-mist",
      text: "white",
    },
  },

  {
    id: 8,
    name: "Portfolio Classic",
    category: "Portfolio",
    tag: "",
    istag: false,
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
    ismultiple: false,
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
  // NEW PREMIUM TEMPLATES
  {
    id: 9,
    name: "Blurred Gradient",
    category: "Social Media",
    tag: "OG Studio",
    istag: true,
    blurred: true,
    gradient: "radial-azure-depths",

    title: "Create Beautiful OG Images Here",
    subtitle: "",
    titleColor: "#FFFFFF",
    subtitleColor: "#FFFFFF",
    authorColor: "#FFFFFF",
    titleSize: 52,

    hasImage: false,
    hasLogo: true,
    hasAuthor: false,
    ismultiple: true,

    logoUrl: "",
    logoUrls: ["/ogImage.png", "/ogImage.png", "/ogImage.png"],

    imagePosition: undefined,

    logoPositions: [
      { x: 310, y: 312, width: 62, height: 62, borderRadius: 50 },
      { x: 420, y: 312, width: 62, height: 62, borderRadius: 50 },
      { x: 530, y: 312, width: 62, height: 62, borderRadius: 50 },
    ],

    tagPosition: {
      x: 415,
      y: 180,
      borderWidth: 1,
      borderColor: "#3b82f6",
      borderRadius: 10,
    },
    contentPosition: {
      x: 168,
      y: 195,
      width: 600,
      textAlign: "center",
    },

    preview: {
      bg: "radial-azure-depths",
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
