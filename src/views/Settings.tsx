import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Lock, User, Globe, Moon } from "lucide-react";
import { motion } from "framer-motion";

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
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const Settings = () => {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    image: "",
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <div className="container flex items-center h-16 px-4">
          <Link to="/dashboard" className="mr-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="font-bold text-lg">Settings</h1>
        </div>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container max-w-4xl px-4 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside variants={itemVariants} className="space-y-1">
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button variant="hero-outline" className="w-full justify-start text-primary border-primary/20 bg-primary/5">
                <User className="mr-2 h-4 w-4" /> Account
              </Button>
            </motion.div>

            {[
              { icon: Lock, label: "Security" },
              { icon: Bell, label: "Notifications" },
              { icon: Globe, label: "Language" },
              { icon: Moon, label: "Appearance" },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                  <item.icon className="mr-2 h-4 w-4" /> {item.label}
                </Button>
              </motion.div>
            ))}
          </motion.aside>

          {/* Main */}
          <motion.div variants={itemVariants} className="md:col-span-3 space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name || ""} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue={user?.email || ""} disabled />
                    <p className="text-[10px] text-muted-foreground">Contact support to change your email.</p>
                  </div>
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button>Save Changes</Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <Separator className="my-6" />

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Permanently delete your account and all data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button variant="destructive">Delete Account</Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
