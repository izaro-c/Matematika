import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'


import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex]
      }),
    },
    react(),
    tailwindcss(),
  ],
})
