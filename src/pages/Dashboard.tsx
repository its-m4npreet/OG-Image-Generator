import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Hexagon, Search, Plus, LayoutGrid } from "lucide-react";

const categories = ["All", "Blog", "SaaS", "Portfolio", "Product Launch"] as const;

const templates = [
  { id: 1, name: "Minimal Blog", category: "Blog", gradient: "from-primary/30 to-secondary/10" },
  { id: 2, name: "SaaS Launch", category: "SaaS", gradient: "from-primary/40 to-primary/5" },
  { id: 3, name: "Dark Portfolio", category: "Portfolio", gradient: "from-secondary/20 to-primary/10" },
  { id: 4, name: "Product Hero", category: "Product Launch", gradient: "from-primary/20 via-card to-secondary/20" },
  { id: 5, name: "Tech Article", category: "Blog", gradient: "from-secondary/30 to-card" },
  { id: 6, name: "Startup Pitch", category: "SaaS", gradient: "from-primary/25 to-card" },
  { id: 7, name: "Creative Folio", category: "Portfolio", gradient: "from-primary/15 via-secondary/10 to-card" },
  { id: 8, name: "Launch Day", category: "Product Launch", gradient: "from-secondary/25 via-primary/15 to-card" },
];

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <Hexagon className="h-6 w-6 text-primary" />
            OG Studio
          </Link>
          <Button variant="hero" size="sm" asChild>
            <Link to="/editor">
              <Plus className="h-4 w-4 mr-1" /> New Image
            </Link>
          </Button>
        </div>
      </header>

      <div className="container px-4 py-8">
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
            >
              <Link to="/editor" className="block group">
                <div className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-150 hover:border-primary/30 hover:scale-[1.02] hover:glow-primary">
                  <div className={`aspect-[1200/630] bg-gradient-to-br ${template.gradient} flex items-center justify-center dot-grid`}>
                    <div className="text-center p-4">
                      <LayoutGrid className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                      <div className="text-lg font-semibold text-foreground">{template.name}</div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.category}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-primary">
                      Use
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
