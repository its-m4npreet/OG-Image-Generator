import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Hexagon, Github, Mail, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authIsLoading, setAuthIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">(
    location.pathname === "/login" ? "signin" : "signup"
  );

  useEffect(() => {
    if (location.pathname === "/login") setMode("signin");
    if (location.pathname === "/signup") setMode("signup");
  }, [location.pathname]);

  const handleOAuthAuth = async (provider: "google" | "github") => {
    setAuthIsLoading(true);
    setTimeout(() => {
      navigate("/dashboard");
      setAuthIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 font-semibold text-foreground hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Hexagon className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">OG Studio</span>
            </div>
            
            <CardTitle className="text-2xl">
              {mode === "signup" ? "Create Your Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {mode === "signup"
                ? "Sign up with GitHub or Google to get started"
                : "Sign in with GitHub or Google to continue"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              className="w-full"
              onClick={() => handleOAuthAuth("github")}
              disabled={authIsLoading}
              size="lg"
            >
              <Github className="mr-2 h-4 w-4" />
              {authIsLoading ? "Connecting..." : "Continue with GitHub"}
            </Button>

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

            <Separator className="bg-border" />

            <div className="space-y-3">
              <p className="text-center text-xs text-muted-foreground">
                {mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => navigate("/signup")}
                      className="font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </p>
              <p className="text-center text-xs text-muted-foreground">
                OAuth-only authentication. No password required.
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Auth;
