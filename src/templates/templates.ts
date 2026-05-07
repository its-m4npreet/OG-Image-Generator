// OG Image Templates
// All templates with default image size: 550x350

export const templates = [
  // Blog Templates
  {
    id: 1,
    name: "Minimal Blog",
    category: "Blog",
    gradient: "from-red-500 to-orange-400",
    title: "Your Amazing Blog Title",
    subtitle: "A compelling description that captures attention",
    hasImage: false,
    hasLogo: false,
    imageUrl: "",
    logoUrl: "",
    imagePosition: undefined,
    logoPosition: undefined,
    preview: {
      bg: "from-red-500 to-orange-400",
      text: "white",
    },
  },
  {
    id: 2,
    name: "Blog with Hero Image",
    category: "Blog",
    gradient: "from-blue-600/30 to-cyan-500/20",
    title: "The Future of React",
    subtitle: "Exploring new patterns and best practices",
    hasImage: true,
    hasLogo: true,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: { x: 175, y: 140, width: 550, height: 350 },
    logoPosition: { x: 50, y: 50, width: 80, height: 80 },
    preview: {
      bg: "from-blue-600/30 to-cyan-500/20",
      text: "dark",
    },
  },
  {
    id: 3,
    name: "Dark Tech Article",
    category: "Blog",
    gradient: "from-slate-700 to-slate-500",
    title: "Web Performance Optimization",
    subtitle: "Speed up your website with these proven techniques",
    hasImage: false,
    hasLogo: false,
    imageUrl: "",
    logoUrl: "",
    imagePosition: undefined,
    logoPosition: undefined,
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
    gradient: "from-purple-600/30 to-blue-600/10",
    title: "Introducing NextFlow",
    subtitle: "The faster way to build modern applications",
    hasImage: true,
    hasLogo: true,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: { x: 175, y: 140, width: 550, height: 350 },
    logoPosition: { x: 40, y: 40, width: 100, height: 100 },
    preview: {
      bg: "from-purple-600/30 to-blue-600/10",
      text: "dark",
    },
  },
  {
    id: 5,
    name: "Startup Pitch",
    category: "SaaS",
    gradient: "from-orange-500/20 to-pink-600/10",
    title: "AI-Powered Analytics",
    subtitle: "Understand your data like never before",
    hasImage: true,
    hasLogo: true,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: { x: 175, y: 140, width: 550, height: 350 },
    logoPosition: { x: 50, y: 50, width: 90, height: 90 },
    preview: {
      bg: "from-orange-500/20 to-pink-600/10",
      text: "dark",
    },
  },
  {
    id: 6,
    name: "SaaS Minimalist",
    category: "SaaS",
    gradient: "from-cyan-300 to-blue-100",
    title: "Simple. Powerful. Yours.",
    subtitle: "Enterprise-grade tool for everyone",
    hasImage: false,
    hasLogo: false,
    imageUrl: "",
    logoUrl: "",
    imagePosition: undefined,
    logoPosition: undefined,
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
    gradient: "from-pink-500/30 to-rose-500/20",
    title: "Creative Studio",
    subtitle: "Transforming ideas into reality",
    hasImage: true,
    hasLogo: true,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: { x: 175, y: 140, width: 550, height: 350 },
    logoPosition: { x: 60, y: 60, width: 110, height: 110 },
    preview: {
      bg: "from-pink-500/30 to-rose-500/20",
      text: "dark",
    },
  },
  {
    id: 8,
    name: "Portfolio Classic",
    category: "Portfolio",
    gradient: "from-emerald-500/20 to-cyan-500/10",
    title: "John Designer",
    subtitle: "Award-winning design work",
    hasImage: false,
    hasLogo: false,
    imageUrl: "",
    logoUrl: "",
    imagePosition: undefined,
    logoPosition: undefined,
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
    gradient: "from-violet-600/30 to-indigo-600/20",
    title: "Introducing CloudSync Pro",
    subtitle: "Sync. Collaborate. Thrive.",
    hasImage: true,
    hasLogo: true,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: { x: 175, y: 140, width: 550, height: 350 },
    logoPosition: { x: 45, y: 45, width: 95, height: 95 },
    preview: {
      bg: "from-violet-600/30 to-indigo-600/20",
      text: "light",
    },
  },
  {
    id: 10,
    name: "Launch Day Bold",
    category: "Product Launch",
    gradient: "from-red-500 to-pink-500",
    title: "Breaking News: SuperApp v2",
    subtitle: "Faster, smarter, more powerful",
    hasImage: true,
    hasLogo: true,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: { x: 175, y: 140, width: 550, height: 350 },
    logoPosition: { x: 55, y: 55, width: 85, height: 85 },
    preview: {
      bg: "from-red-500 to-pink-500",
      text: "white",
    },
  },
  {
    id: 11,
    name: "Launch Minimal",
    category: "Product Launch",
    gradient: "from-gray-100 to-white",
    title: "New Era Begins",
    subtitle: "What happens next will change everything",
    hasImage: false,
    hasLogo: false,
    imageUrl: "",
    logoUrl: "",
    imagePosition: undefined,
    logoPosition: undefined,
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
    gradient: "from-yellow-100/40 to-orange-100/20",
    title: "Check Out My Latest Post!",
    subtitle: "Join the conversation",
    hasImage: true,
    hasLogo: false,
    imageUrl: "/ogImage.png",
    logoUrl: "",
    imagePosition: { x: 175, y: 140, width: 550, height: 350 },
    logoPosition: undefined,
    preview: {
      bg: "from-yellow-100/40 to-orange-100/20",
      text: "dark",
    },
  },
  {
    id: 13,
    name: "Social Engagement",
    category: "Social Media",
    gradient: "from-purple-400 to-pink-400",
    title: "Go Follow Us!",
    subtitle: "Amazing content coming soon",
    hasImage: true,
    hasLogo: true,
    imageUrl: "/ogImage.png",
    logoUrl: "/ogImage.png",
    imagePosition: { x: 175, y: 140, width: 550, height: 350 },
    logoPosition: { x: 50, y: 50, width: 100, height: 100 },
    preview: {
      bg: "from-purple-400 to-pink-400",
      text: "white",
    },
  },
  {
    id: 14,
    name: "Social Minimal",
    category: "Social Media",
    gradient: "from-green-100 to-green-50",
    title: "New Tutorial Live",
    subtitle: "Learn something new today",
    hasImage: false,
    hasLogo: false,
    imageUrl: "",
    logoUrl: "",
    imagePosition: undefined,
    logoPosition: undefined,
    preview: {
      bg: "from-green-100 to-green-50",
      text: "dark",
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
