import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Hexagon, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

const authBaseUrl = (import.meta.env.VITE_AUTH_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8000";

const Login = () => {
  const { method } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mode = method === "google" ? "google" : "email";

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const callbackUrl = `${window.location.origin}/dashboard`;
    const params = new URLSearchParams({ callbackUrl });
    window.location.href = `${authBaseUrl}/api/auth/signin/google?${params.toString()}`;
  };

  const handleEmailLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password.",
      });
      return;
    }

    toast({
      title: "Logged in with email",
      description: `Welcome back, ${email}`,
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 font-semibold text-foreground">
          <Hexagon className="h-5 w-5 text-primary" />
          OG Studio
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{mode === "google" ? "Login with Gmail" : "Login with Email"}</CardTitle>
            <CardDescription>Choose your preferred sign-in method.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant={mode === "email" ? "default" : "outline"} asChild>
                <Link to="/login/email">Email</Link>
              </Button>
              <Button variant={mode === "google" ? "default" : "outline"} asChild>
                <Link to="/login/google">Gmail</Link>
              </Button>
            </div>

            <Separator className="bg-border" />

            {mode === "google" ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Use your Google account to continue.</p>
                <Button variant="hero" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
                  {isLoading ? "Connecting..." : "Continue with Gmail"}
                </Button>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleEmailLogin}>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Mail className="mr-1 h-4 w-4" />
                  Login with Email
                </Button>
              </form>
            )}

            <p className="text-sm text-muted-foreground">
              New here?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;