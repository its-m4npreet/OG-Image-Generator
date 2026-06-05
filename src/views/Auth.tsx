import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Hexagon, Github, Mail,ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { signIn, useSession } from "next-auth/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 } as const,
  },
} as const;

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { status } = useSession();
  const [authIsLoading, setAuthIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">(
    location.pathname === "/login" ? "signin" : "signup"
  );

  useEffect(() => {
    if (location.pathname === "/login") setMode("signin");
    if (location.pathname === "/signup") setMode("signup");
  }, [location.pathname]);

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/dashboard");
    }
  }, [status, navigate]);

  const handleOAuthAuth = async (provider: "google" | "github") => {
    setAuthIsLoading(true);
    try {
      console.log(`Signin started for provider: ${provider}`);
      // Use redirect: false to manually handle redirection and see errors
      const result = await signIn(provider, { 
        callbackUrl: window.location.origin + "/dashboard",
        redirect: false 
      });
      
      console.log("NextAuth result:", result);

      if (result?.error) {
        toast({
          title: "Authentication Error",
          description: result.error === "OAuthSignin" ? "Failed to start OAuth flow. Check if backend is reachable." : result.error,
          variant: "destructive",
        });
      } else if (result?.url) {
        // Manually redirect the browser
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Auth exception:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAuthIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants}>
          <Link to="/" className="mb-6 inline-flex items-center gap-2 font-semibold text-foreground hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="text-center">
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <Hexagon className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">OG Studio</span>
              </motion.div>
              
              <motion.h2 variants={itemVariants} className="text-2xl font-bold">
                {mode === "signup" ? "Create Your Account" : "Welcome Back"}
              </motion.h2>

              <motion.p variants={itemVariants} className="text-sm text-muted-foreground mt-2">
                {mode === "signup"
                  ? "Sign up with GitHub or Google to get started"
                  : "Sign in with GitHub or Google to continue"}
              </motion.p>
            </CardHeader>

            <CardContent className="space-y-4">
              <motion.div variants={buttonVariants}>
                <Button
                  className="w-full"
                  onClick={() => handleOAuthAuth("github")}
                  disabled={authIsLoading}
                  size="lg"
                >
                  <Github className="mr-2 h-4 w-4" />
                  {authIsLoading ? "Connecting..." : "Continue with GitHub"}
                </Button>
              </motion.div>

              <motion.div variants={buttonVariants}>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuthAuth("google")}
                  disabled={authIsLoading}
                  size="lg"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {authIsLoading ? "Connecting..." : "Continue with Google"}
                </Button>
              </motion.div>

              <Separator className="bg-border" />

              <motion.div variants={itemVariants} className="space-y-3">
                <p className="text-center text-xs text-muted-foreground">
                  {mode === "signup" ? (
                    <>
                      Already have an account?{" "}
                      <motion.button
                        onClick={() => navigate("/login")}
                        className="font-semibold text-primary hover:underline cursor-pointer"
                      >
                        Sign in
                      </motion.button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <motion.button
                        onClick={() => navigate("/signup")}
                        className="font-semibold text-primary hover:underline cursor-pointer"
                      >
                        Sign up
                      </motion.button>
                    </>
                  )}
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  OAuth-only authentication. No password required.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-center text-xs text-muted-foreground mt-4"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Auth;
