
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
      // Add explicit HMR configuration to help with connection issues
      timeout: 10000,
      overlay: true,
    },
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
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          // Create more chunks to reduce chunk size
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select', '@radix-ui/react-switch'],
          shadcn: ['@/components/ui/button', '@/components/ui/dialog', '@/components/ui/input', '@/components/ui/label'],
          // Create a separate chunk for electron to avoid browser compatibility issues
          browser: []
        }
      }
    }
  },
  base: process.env.ELECTRON === 'true' ? './' : '/',
  // Optimize Electron build
  optimizeDeps: {
    exclude: ['electron']
  },
}));
