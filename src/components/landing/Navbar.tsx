import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Hexagon, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
    },
  }),
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

const Navbar = () => {
  const { status } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#testimonials", label: "Testimonials" },
    // { href: "#pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="container flex items-center justify-between h-full px-4 mx-auto">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-foreground hover:opacity-80 transition-opacity"
        >
          <Hexagon className="h-5 w-5 text-primary" />
          <span className="font-mono text-sm font-bold tracking-wide pt-1">
            OG Studio
          </span>
        </Link>

        <motion.div
          className="hidden md:flex items-center gap-9"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {navLinks.map((link, i) =>
            link.href.startsWith("#") ? (
              <motion.a
                key={link.label}
                href={link.href}
                custom={i}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ color: "var(--foreground)" }}
                className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </motion.a>
            ) : (
              <MotionLink
                key={link.label}
                to={link.href}
                custom={i}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ color: "var(--foreground)" }}
                className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </MotionLink>
            )
          )}
        </motion.div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {status === "authenticated" ? (
            <motion.div variants={buttonVariants}>
              <Button variant="hero" size="sm" className="btn-shimmer" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div variants={buttonVariants}>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
              </motion.div>

              <motion.div variants={buttonVariants}>
                <Button variant="hero" size="sm" className="btn-shimmer" asChild>
                  <Link to="/signup">Get Started &rarr;</Link>
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
