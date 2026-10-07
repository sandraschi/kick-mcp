import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ['goliath'],
    port: 10969,
    host: "127.0.0.1",
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:10968",
        changeOrigin: true,
      },
      "/mcp": {
        target: "http://127.0.0.1:10968",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 10969,
    host: "127.0.0.1",
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:10968",
        changeOrigin: true,
      },
      "/mcp": {
        target: "http://127.0.0.1:10968",
        changeOrigin: true,
      },
    },
  },
});
