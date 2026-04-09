import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Hexagon, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
          <Hexagon className="h-6 w-6 text-primary" />
          OG Studio
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Templates
          </Link>
          <Link to="/editor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Editor
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {status === "authenticated" ? (
            <Button variant="hero" size="sm" asChild>
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
