import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api/auth": {
        target: "http://localhost:8000",
        changeOrigin: false,
        secure: false,
        xfwd: true,
      },
      "/api/signup": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        xfwd: true,
      },
      "/api/user": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        xfwd: true,
      },
    },
    hmr: {
      overlay: false,
    },
  },
  define: {
    "process.env.NEXTAUTH_URL": JSON.stringify(
      process.env.VITE_AUTH_BASE_URL || "http://localhost:8080"
    ),
    "process.env.NEXTAUTH_URL_INTERNAL": JSON.stringify(
      process.env.NEXTAUTH_URL_INTERNAL || "http://localhost:8000"
    ),
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
