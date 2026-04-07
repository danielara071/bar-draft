import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "lucide-React": "lucide-react",
    },
    dedupe: ["react", "react-dom", "lucide-react"],
  },
  optimizeDeps: {
    exclude: ["aframe", "ar.js"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/rss": {
      target: "https://carpetasfcb.com",
      changeOrigin: true,
      },
      "/next-game": {
      target: "https://barca-scraper-7tag.onrender.com",
      changeOrigin: true,
      },
    },
  },
});