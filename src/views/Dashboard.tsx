/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Hexagon,
  Search,
  SlidersHorizontal,
  LogOut,
  User as UserIcon,
  Settings,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { templates, categories } from "@/templates";
import { gradients, gradientMap, solidColors, colorHexMap } from "@/lib/colors";

// Access any color data needed
const allGradients = gradientMap;
const hexValue = colorHexMap["bg-primary-700"];

const Dashboard = () => {
  const { data: session, status } = useSession();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/login");
    }
  }, [status, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        {/* Top bar skeleton */}
        <div className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="container flex items-center justify-between h-16 px-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-32 hidden sm:block" />
              <Skeleton className="h-9 w-32 hidden sm:block" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </div>

        <div className="container px-4 py-8 mx-auto">
          {/* Heading skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>

          {/* Filters skeleton */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <Skeleton className="h-10 w-full max-w-sm" />
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-9 w-20" />
              ))}
            </div>
          </div>

          {/* Templates skeleton grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-full">
                <div className="rounded-2xl border border-border bg-card overflow-hidden h-full flex flex-col">
                  {/* Preview skeleton */}
                  <Skeleton className="h-48 flex-shrink-0" />

                  {/* Info section skeleton */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-10 w-full mt-auto rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || "U";

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background gradient effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Top bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <div className="container flex items-center justify-between h-16 px-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-lg text-foreground hover:opacity-80 transition-opacity"
            >
              <Hexagon className="h-6 w-6 text-primary" />
              OG Studio
            </Link>
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="hero"
                size="sm"
                asChild
                className="hidden sm:flex"
              >
                <Link to="/editor">
                  <SlidersHorizontal className="h-4 w-4 mr-1" /> Customize Image
                </Link>
              </Button>
            </motion.div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {userInitial.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "Anonymous"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">Templates</h1>
            <p className="text-muted-foreground">
              Pick a template and customize it in the editor.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
          >
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <motion.div className="flex gap-2 flex-wrap" layout>
              {categories.map((cat, i) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Button
                    variant={activeCategory === cat ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
                    className="text-sm"
                  >
                    {cat}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="h-full"
            >
              <Link
                to={`/editor?template=${template.id}&title=${encodeURIComponent(template.title)}&subtitle=${encodeURIComponent(template.subtitle)}&gradient=${encodeURIComponent(template.gradient)}&titleColor=${encodeURIComponent(template.titleColor)}&subtitleColor=${encodeURIComponent(template.subtitleColor)}&titleSize=${template.titleSize}&logo=${template.hasLogo && template.logoUrl ? template.logoUrl : ""}&image=${template.hasImage && template.imageUrl ? template.imageUrl : ""}${template.imagePosition ? `&imagePosition=${encodeURIComponent(JSON.stringify(template.imagePosition))}` : ""}${template.logoPosition ? `&logoPosition=${encodeURIComponent(JSON.stringify(template.logoPosition))}` : ""}${template.contentPosition ? `&contentPosition=${encodeURIComponent(JSON.stringify(template.contentPosition))}` : ""}&hasAuthor=${template.hasAuthor}`}
                className="block group h-full rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200"
              >
                {/* Replace the entire preview div inside the Link with this: */}

                <div className="h-48 relative overflow-hidden flex-shrink-0" >
                  {/* Scale wrapper: 550×350 template scaled down to fit card width */}
                  <div
                    className="absolute top-0 left-0 origin-top-left"
                    style={{
                      width: 550,
                      height: 350,
                      transform: `scale(${192 / 350})`, // 192px = h-48, scale height to fit
                      background: template.gradient.startsWith("from-")
                        ? undefined
                        : template.gradient,
                      overflow: "hidden",
                    }}
                  >
                    {/* Apply Tailwind gradient if it's a Tailwind class string */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${template.gradient}`}
                    />

                    {/* Image */}
                    {template.hasImage &&
                      template.imageUrl &&
                      template.imagePosition && (
                        <img
                          src={template.imageUrl}
                          alt=""
                          style={{
                            position: "absolute",
                            left: template.imagePosition.x,
                            top: template.imagePosition.y,
                            width: template.imagePosition.width,
                            height: template.imagePosition.height,
                            transform: `rotate(${template.imagePosition.rotation ?? 0}deg)`,
                            borderRadius: 8,
                            filter:
                              template.imagePosition.shadowBlur > 0
                                ? `drop-shadow(0 0 ${template.imagePosition.shadowBlur}px ${template.imagePosition.shadowColor ?? "#000"})`
                                : "none",
                            objectFit: "cover",
                          }}
                        />
                      )}

                    {/* Logo */}
                    {/* {template.hasLogo && template.logoUrl && template.logoPosition && (
      <img
        src={template.logoUrl}
        alt=""
        style={{
          position: "absolute",
          left: template.logoPosition.x,
          top: template.logoPosition.y,
          width: template.logoPosition.width,
          height: template.logoPosition.height,
          borderRadius: 10,
          objectFit: "cover",
        }}
      />
    )} */}

                    {/* Text content */}
                    {template.contentPosition &&
                      (() => {
                        const cp = template.contentPosition;
                        const scale = 192 / 350; // same scale as the container
                        const isCenter =
                          !template.hasImage || cp.textAlign === "center";
                        const left = isCenter ? (550 - cp.width) / 2 : cp.x;
                        const fontSizeMultiplier = template.hasImage
                          ? 0.5
                          : 0.35; // smaller if no image

                        // Calculate vertical center when no image
                        let top = cp.y;
                        if (!template.hasImage) {
                          const estimatedHeight =
                            Math.round(
                              (template.titleSize / scale) *
                                fontSizeMultiplier *
                                1.5,
                            ) +
                            Math.round(
                              ((template.titleSize * 0.36) / scale) *
                                fontSizeMultiplier *
                                1.5,
                            );
                          top = (350 - estimatedHeight) / 2;
                        }

                        return (
                          <div
                            style={{
                              position: "absolute",
                              left,
                              top,
                              width: cp.width,
                              textAlign: cp.textAlign as any,
                            }}
                          >
                            <div
                              style={{
                                fontSize: Math.round(
                                  (template.titleSize / scale) *
                                    fontSizeMultiplier,
                                ),
                                fontWeight: 700,
                                lineHeight: 1.15,
                                color: template.titleColor,
                                marginBottom: Math.round(
                                  template.titleSize * 0.3 * fontSizeMultiplier,
                                ),
                                wordBreak: "break-word",
                              }}
                            >
                              {template.title}
                            </div>
                            <div
                              style={{
                                fontSize: Math.round(
                                  ((template.titleSize * 0.36) / scale) *
                                    fontSizeMultiplier,
                                ),
                                color: template.subtitleColor,
                                lineHeight: 1.4,
                                wordBreak: "break-word",
                              }}
                            >
                              {template.subtitle}
                            </div>
                          </div>
                        );
                      })()}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
