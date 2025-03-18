
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
    react({
      // Force React to be available in scope
      jsxRuntime: 'automatic',
      jsxImportSource: 'react'
    }),
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
    sourcemap: mode === 'development', // Only generate sourcemaps in development
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode !== 'development', // Only drop console in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create smaller, more manageable chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') && !id.includes('@tanstack') && !id.includes('@radix-ui')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'radix-vendor';
            }
            if (id.includes('@tanstack')) {
              return 'tanstack-vendor';
            }
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'motion-vendor';
            }
            if (id.includes('@xyflow')) {
              return 'xyflow-vendor';
            }
            return 'vendor'; // all other packages
          }
        }
      }
    }
  },
  base: process.env.ELECTRON === 'true' ? './' : '/',
  // Optimize Electron build
  optimizeDeps: {
    exclude: ['electron']
  },
  // Reduce memory usage during build
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    target: ['es2020', 'chrome110', 'edge112', 'firefox112', 'safari15']
  },
}));
