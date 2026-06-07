/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useCallback } from "react";
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
  Crown,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { clearSessionStorage } from "@/lib/token-storage";
import { templates, categories } from "@/templates";
import { gradients, solidColors, gradientMap, patternMap } from "@/lib/colors";

function TemplatePreview({ template }: { template: (typeof templates)[number] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const gradientCSS = gradientMap.find(g => g.tailwind === template.gradient)?.css;
  const templatePattern = "pattern" in template ? patternMap[template.pattern as number] : null;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setScale(width / 550);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isStandardGradient = template.gradient.startsWith("from-");

  return (
    <div ref={containerRef} className="w-full aspect-[550/350] relative overflow-hidden flex-shrink-0">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: 550,
          height: 350,
          transform: `scale(${scale})`,
          background: templatePattern
            ? templatePattern.backgroundColor
            : isStandardGradient
              ? undefined
              : gradientCSS,
          overflow: "hidden",
        }}
      >
        {templatePattern ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: templatePattern.backgroundImage,
              backgroundSize: templatePattern.backgroundSize || undefined,
              WebkitMaskImage: templatePattern.WebkitMaskImage || undefined,
              maskImage: templatePattern.maskImage || undefined,
              WebkitMaskComposite: templatePattern.WebkitMaskComposite as React.CSSProperties['WebkitMaskComposite'] || undefined,
              maskComposite: templatePattern.maskComposite as React.CSSProperties['maskComposite'] || undefined,
            }}
          />
        ) : isStandardGradient ? (
          <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient}`} />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: gradientCSS }}
          />
        )}

        {"blurred" in template && template.blurred && (
          <div
            className="absolute inset-0"
            style={{ backdropFilter: "blur(1.5px)" }}
          />
        )}

        {template.hasImage &&
          template.imageUrl &&
          template.imagePosition && (
            <img
              src={template.imageUrl}
              alt=""
              style={{
                position: "absolute",
                left: template.imagePosition.x * (550 / 900),
                top: template.imagePosition.y * (350 / 630),
                width: template.imagePosition.width * (550 / 900),
                height: template.imagePosition.height * (350 / 630),
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

        {"istag" in template && template.istag && template.tag && "tagPosition" in template && template.tagPosition && (() => {
          const tagX = template.tagPosition.x * (550 / 900) - 10;
          const tagY = template.tagPosition.y * (350 / 630);
          const scaleY = 350 / 630;
          const cp = template.contentPosition;
          const titleSize = template.hasImage ? 32 : 24;
          const subtitleSize = template.hasImage ? 15 : 14;
          const contentTop = !template.hasImage && cp?.textAlign === "center"
            ? (350 - titleSize * 1.5 - (template.subtitle ? subtitleSize * 1.5 : 0)) / 2
            : cp ? cp.y * scaleY : 0;
          const tagHeight = 20;
          const adjustedY = contentTop && (tagY + tagHeight > contentTop) ? contentTop - tagHeight - 2 : tagY;
          return (
            <div
              style={{
                position: "absolute",
                left: tagX,
                top: adjustedY,
                border: `${template.tagPosition.borderWidth || 1}px solid ${template.tagPosition.borderColor || "#3b82f6"}`,
                borderRadius: template.tagPosition.borderRadius || 10,
                padding: "4px 10px",
                fontSize: "11px",
                fontWeight: 600,
                color: template.tagPosition.borderColor || "#3b82f6",
                whiteSpace: "nowrap",
              }}
            >
              {template.tag}
            </div>
          );
        })()}

        {"hasLogo" in template && template.hasLogo && "logoPositions" in template && template.logoPositions && (() => {
          const contentCentered = !template.hasImage && template.contentPosition?.textAlign === "center";
          const logoYOffset = contentCentered ? 40 : 0;
          return template.logoPositions.map((logoPos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: logoPos.x * (550 / 900),
                top: logoPos.y * (350 / 630) + logoYOffset,
                width: logoPos.width * (550 / 900),
                height: logoPos.height * (350 / 630),
                borderRadius: logoPos.borderRadius ? `${logoPos.borderRadius}%` : 0,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />
          ));
        })()}

        {template.contentPosition &&
          (() => {
            const cp = template.contentPosition;
            const scaleX = 550 / 900;
            const scaleY = 350 / 630;
            const isCenter =
              template.id === 5 || !template.hasImage || cp.textAlign === "center";
            const left = isCenter ? (550 - cp.width * scaleX) / 2 : cp.x * scaleX;
            const titleSize = template.hasImage ? 32 : 24;
            const subtitleSize = template.hasImage ? 15 : 14;

            const top = template.id === 5
              ? cp.y * scaleY + 20
              : template.id === 6
                ? cp.y * scaleY + 15
                : !template.hasImage && cp.textAlign === "center"
                ? (350 - titleSize * 1.5 - (template.subtitle ? subtitleSize * 1.5 : 0)) / 2
                : cp.y * scaleY;

            return (
              <div
                style={{
                  position: "absolute",
                  left,
                  top,
                  width: cp.width * scaleX,
                  textAlign: template.id === 5 ? "center" : cp.textAlign as any,
                }}
              >
                <div
                  style={{
                    fontSize: titleSize,
                    fontWeight: 700,
                    lineHeight: 1.15,
                    color: template.titleColor,
                    marginBottom: 4,
                    wordBreak: "break-word",
                  }}
                >
                  {template.title}
                </div>
                {template.subtitle && (
                  <div
                    style={{
                      fontSize: subtitleSize,
                      color: template.subtitleColor,
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                    }}
                  >
                    {template.subtitle}
                  </div>
                )}
              </div>
            );
          })()}
      </div>
    </div>
  );
}

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
                    <Skeleton className="h-10 w-full mt-auto rounded-sm" />
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
    clearSessionStorage();
    localStorage.removeItem("next-auth.session-data");
    localStorage.removeItem("next-auth.callback-url");
    localStorage.removeItem("next-auth.csrf-token");
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
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16 px-4">
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-lg text-foreground hover:opacity-80 transition-opacity"
            >
              <Hexagon className="h-6 w-6 text-primary" />
              OG Studio
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div >
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
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9 border border-border btn-shimmer">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {userInitial.toUpperCase()}
                    </AvatarFallback>
                    {(user as any)?.isPremium && (
                      <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 shadow-sm">
                        <Crown className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none flex items-center gap-1.5">
                      {user?.name || "Anonymous"}
                      {(user as any)?.isPremium && (
                        <Crown className="h-3.5 w-3.5 text-amber-500" />
                      )}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
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
      </header>

      <div className="w-full px-4 py-8 max-sm:pt-0">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2 max-sm:hidden">Templates</h1>
            <p className="text-muted-foreground max-sm:hidden">
              Pick a template and customize it in the editor.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex flex-row items-start sm:items-center gap-4 mb-8"
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
            {/* Desktop: row of category buttons */}
            <motion.div className="hidden sm:flex gap-2 flex-wrap" layout>
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
            {/* Mobile: dropdown */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between py-3">
                    {activeCategory}
                    <span className="ml-2">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full min-w-[140px]">
                  {categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={activeCategory === cat ? "bg-accent" : ""}
                    >
                      {cat}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                  to={`/editor?template=${template.id}&title=${encodeURIComponent(template.title)}&subtitle=${encodeURIComponent(template.subtitle)}&gradient=${encodeURIComponent(template.gradient)}&titleColor=${encodeURIComponent(template.titleColor)}&subtitleColor=${encodeURIComponent(template.subtitleColor)}&authorColor=${encodeURIComponent("authorColor" in template && template.authorColor ? template.authorColor : template.subtitleColor)}&titleSize=${template.titleSize}&logo=${template.hasLogo && template.logoUrl ? template.logoUrl : ""}&image=${template.hasImage && template.imageUrl ? template.imageUrl : ""}${template.imagePosition ? `&imagePosition=${encodeURIComponent(JSON.stringify(template.imagePosition))}` : ""}${"logoPosition" in template && template.logoPosition ? `&logoPosition=${encodeURIComponent(JSON.stringify(template.logoPosition))}` : ""}${"logoPositions" in template && template.logoPositions ? `&logoPositions=${encodeURIComponent(JSON.stringify(template.logoPositions))}` : ""}${template.contentPosition ? `&contentPosition=${encodeURIComponent(JSON.stringify(template.contentPosition))}` : ""}&hasAuthor=${template.hasAuthor}${"pattern" in template && template.pattern !== undefined ? `&backgroundType=pattern&pattern=${template.pattern}` : ""}${"logoUrls" in template && template.logoUrls ? `&logoUrls=${encodeURIComponent(JSON.stringify(template.logoUrls))}` : ""}${"istag" in template && template.istag && template.tag ? `&istag=true&tag=${encodeURIComponent(template.tag)}` : ""}${"tagPosition" in template && template.tagPosition ? `&tagPosition=${encodeURIComponent(JSON.stringify(template.tagPosition))}` : ""}`}
                  className="block group h-full rounded-sm border border-border bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200"
                >
                  <TemplatePreview template={template} />
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
