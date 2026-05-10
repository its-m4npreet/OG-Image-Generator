/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Hexagon, Search, Plus, LayoutGrid, LogOut, User as UserIcon, Settings, BookOpen } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { templates, categories } from "@/templates";
import { 
  gradients, 
  gradientMap, 
  solidColors, 
  colorHexMap 
} from "@/lib/colors";

// Access any color data needed
const allGradients = gradientMap;
const hexValue = colorHexMap["bg-primary-700"];

const Dashboard = () => {
  const { data: session, status } = useSession();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/login");
    }
    // Check if user is admin from session
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      setIsAdmin(true);
    }
  }, [status, session, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Hexagon className="h-10 w-10 text-primary animate-pulse" />
          <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
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
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <Hexagon className="h-6 w-6 text-primary" />
            OG Studio
          </Link>
          
          <div className="flex items-center gap-4">
            <Button variant="hero" size="sm" asChild className="hidden sm:flex">
              <Link to="/editor">
                <Plus className="h-4 w-4 mr-1" /> New Image
              </Link>
            </Button>

            {isAdmin && (
              <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                <Link to="/admin/templates">
                  <BookOpen className="h-4 w-4 mr-1" /> Manage Templates
                </Link>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {userInitial.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "Anonymous"}</p>
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
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin/templates" className="cursor-pointer">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Manage Templates</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
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

      <div className="container px-4 py-8 mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Templates</h1>
          <p className="text-muted-foreground">Pick a template and customize it in the editor.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="text-sm"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="h-full"
            >
              <Link 
                to={`/editor?template=${template.id}&title=${encodeURIComponent(template.title)}&subtitle=${encodeURIComponent(template.subtitle)}&gradient=${encodeURIComponent(template.gradient)}&titleColor=${encodeURIComponent(template.titleColor)}&subtitleColor=${encodeURIComponent(template.subtitleColor)}&logo=${template.hasLogo && template.logoUrl ? template.logoUrl : ''}&image=${template.hasImage && template.imageUrl ? template.imageUrl : ''}${template.imagePosition ? `&imagePosition=${encodeURIComponent(JSON.stringify(template.imagePosition))}` : ''}${template.logoPosition ? `&logoPosition=${encodeURIComponent(JSON.stringify(template.logoPosition))}` : ''}&hasAuthor=${template.hasAuthor}`}
                className="block group h-full"
              >
                <div className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-150 hover:border-primary/30 hover:scale-[1.02] hover:shadow-xl h-full flex flex-col">
                  {/* Preview - Fixed Height */}
                  <div className={`h-48 bg-gradient-to-br ${template.gradient} flex items-center justify-center relative overflow-hidden flex-shrink-0`}>
                    <div className="absolute inset-0 opacity-5 dot-grid" />
                    
                    {/* Logo placeholder (top-left) */}
                    {template.hasLogo && (
                      <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <div className="w-6 h-6 rounded bg-white/40" />
                      </div>
                    )}
                    
                    {/* Image placeholder - positioned according to template */}
                    {template.hasImage && template.imagePosition && (
                      <>
                        {/* Scale the preview coordinates to fit the 192px height preview */}
                        {template.imagePosition.y >= 300 ? (
                          // Bottom placement - show at bottom
                          <div 
                            className="absolute w-12 h-16 bg-white/15 backdrop-blur-sm border border-white/25 rounded-lg opacity-70"
                            style={{
                              bottom: '4px',
                              left: '50%',
                              transform: 'translateX(-50%)'
                            }}
                          />
                        ) : (
                          // Right or left placement
                          <div 
                            className={`absolute w-12 h-20 bg-white/15 backdrop-blur-sm border border-white/25 rounded-lg opacity-70 ${
                              template.imagePosition.x > 450 ? 'right-2' : 'left-2'
                            }`}
                            style={{
                              top: '50%',
                              transform: 'translateY(-50%)'
                            }}
                          />
                        )}
                      </>
                    )}
                    
                    {/* Text content preview - positioned at top to avoid overlap */}
                    <div className={`text-center relative z-10 max-w-xs px-3 ${template.hasImage && template.imagePosition?.y >= 300 ? 'pt-0' : 'pt-2'}`}>
                      <h3 className={`text-sm font-bold mb-1 line-clamp-2 ${template.preview.text === 'white' ? 'text-white' : 'text-gray-900'}`}>
                        {template.title}
                      </h3>
                      <p className={`text-xs line-clamp-1 ${template.preview.text === 'white' ? 'text-white/70' : 'text-gray-700'}`}>
                        {template.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Info section - Flexible height */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div>
                      <div className="text-sm font-semibold text-foreground mb-1">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.category}</div>
                    </div>
                    
                    <Button variant="default" size="sm" className="w-full text-xs mt-auto">
                      Use Template
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
