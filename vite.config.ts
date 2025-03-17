
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
      // Increase HMR timeout to prevent connection issues
      timeout: 30000, // Increased from 10000ms to 30000ms
      overlay: true,
      protocol: 'ws',
      host: 'localhost',
    },
    // Add proxy timeout settings
    proxy: {
      // Configure proxy to increase timeout
      "/.vite": {
        target: "/",
        rewrite: (path) => path,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Connection', 'keep-alive');
          });
        }
      }
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
