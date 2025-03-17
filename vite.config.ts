
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // Fix HMR connectivity issues
      clientPort: 443,
      host: "e1dc33f9-12d8-4b63-9bec-0aaea4fb8ea9.lovableproject.com",
      protocol: 'wss',
      timeout: 120000,
    },
    // Increase timeouts
    watch: {
      usePolling: true,
      interval: 1000,
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-popover', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          // Create a separate chunk for electron to avoid browser compatibility issues
          browser: []
        }
      }
    }
  },
  base: process.env.ELECTRON === 'true' ? './' : '/',
  // Optimize Electron build with improved settings
  optimizeDeps: {
    exclude: ['electron'],
    // Force include problematic dependencies
    include: [
      '@radix-ui/react-popover',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu'
    ],
    esbuildOptions: {
      // Increase build timeout
      keepNames: true,
    },
    // Force pre-bundling of dependencies
    force: true
  },
}));
