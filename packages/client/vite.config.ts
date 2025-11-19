import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    fs: {},
    // Ensure .well-known directory is served correctly
    middlewareMode: false,
  },
  // Explicitly set public directory to ensure .well-known is served
  publicDir: "public",
  resolve: {
    alias: {
      // for TypeScript path alias import like : @/x/y/z
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2022",
    minify: true,
    sourcemap: true,
    // Ensure .well-known files are copied to build output
    copyPublicDir: true,
  },
});
