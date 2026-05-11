import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Edit, Github, Mail, MapPin, User as UserIcon } from "lucide-react";
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
    transition: { duration: 0.5 } as const,
  },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
} as const;

const Profile = () => {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    image: "",
  };
  const initial = user.name.charAt(0) || "U";

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
          <h1 className="font-bold text-lg">Your Profile</h1>
        </div>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container max-w-4xl px-4 py-12"
      >
        <div className="flex flex-col md:flex-row gap-10">
          {/* Avatar and Main Info */}
          <motion.div variants={itemVariants} className="flex flex-col items-center flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Avatar className="h-32 w-32 border-4 border-card shadow-xl mb-6">
                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-4xl leading-none">
                  {initial.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="text-center">
              <h2 className="text-2xl font-bold">{user?.name || "Anonymous User"}</h2>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <MapPin className="h-3 w-3" /> Earth, Orion Arm
              </p>
            </div>

            <motion.div
              variants={itemVariants}
              className="flex gap-2 mt-6"
            >
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Button variant="hero" size="sm">
                  Follow
                </Button>
              </motion.div>

              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border">
                  <Edit className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Details */}
          <motion.div variants={itemVariants} className="flex-1 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Github className="h-4 w-4" /> GitHub Identity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-lg">Verified</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-4 w-4" /> Primary Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-lg overflow-hidden text-ellipsis">{user?.email}</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Activity Overview</CardTitle>
                  <CardDescription>Track your image generation performance.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl font-bold text-primary">124</div>
                      <div className="text-xs text-muted-foreground">Designs</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl font-bold text-secondary">3.2k</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl font-bold text-foreground">8</div>
                      <div className="text-xs text-muted-foreground">Templates</div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Passionate creator using OG Studio to automate open graph images for projects and blogs. Always looking for better ways to speed up the workflow with AI.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
