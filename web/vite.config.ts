import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tanstackStart({
      customViteReactPlugin: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
});
