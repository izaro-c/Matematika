import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'

import rehypeKatex from 'rehype-katex';
import { visualizer } from 'rollup-plugin-visualizer';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);
const { viteEditorApiPlugin } = jiti('./scripts/editor/viteEditorApiPlugin.ts') as typeof import('./scripts/editor/viteEditorApiPlugin');

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    viteEditorApiPlugin(),
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex],
        providerImportSource: "@mdx-js/react"
      }),
    },
    react(),
    tailwindcss(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@content': path.resolve(__dirname, './content'),
    }
  },
  base: "/Matematika/",
  server: {
    host: true,
    hmr: process.env.MATEMATIKA_EDITOR_SRC_ROOT ? false : undefined,
    watch: process.env.MATEMATIKA_EDITOR_SRC_ROOT ? { ignored: ['**'] } : undefined,
  },
  build: {
    target: 'es2020',
    cssMinify: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('contentIndex.json') || id.includes('contentCoverage.json')) {
            return 'content-index-data';
          }
          if (id.includes('node_modules')) {
            if (id.includes('jsxgraph')) return 'vendor-jsxgraph';
            if (id.includes('@monaco-editor') || id.includes('monaco-editor')) return 'vendor-monaco';
            if (id.includes('three') || id.includes('@react-three')) return 'vendor-three';
            if (id.includes('react-force-graph') || id.includes('@xyflow') || id.includes('d3-')) return 'vendor-graph';
            if (id.includes('katex')) return 'vendor-katex';
            if (id.includes('fuse.js')) return 'vendor-fuse';
            if (id.includes('react') || id.includes('wouter')) return 'vendor-react';
          }
        }
      }
    }
  }
})
