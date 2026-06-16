import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

const drafts = new Map<string, string>();

function editorAPI() {
  let viteServer: any;
  return {
    name: 'editor-api',
    enforce: 'pre' as const,
    configureServer(server: any) {
      viteServer = server;
      server.middlewares.use('/api/content', (req: any, res: any) => {
        const url = new URL(req.originalUrl || req.url, `http://${req.headers.host}`)
        
        if (req.method === 'GET') {
          const rawPath = url.searchParams.get('path')
          if (!rawPath) {
            res.statusCode = 400
            return res.end('Missing path')
          }
          const absolutePath = path.resolve(__dirname, 'src', rawPath)
          if (!fs.existsSync(absolutePath)) {
            res.statusCode = 404
            return res.end('File not found')
          }
          const content = fs.readFileSync(absolutePath, 'utf-8')
          res.setHeader('Content-Type', 'text/plain')
          res.end(content)
          return
        }

        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk: any) => { body += chunk.toString() })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              if (!data.path || !data.content) {
                res.statusCode = 400
                return res.end('Missing path or content')
              }
              const absolutePath = path.resolve(__dirname, 'src', data.path)
              const dir = path.dirname(absolutePath)
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
              }
              fs.writeFileSync(absolutePath, data.content, 'utf-8')
              drafts.delete(absolutePath) // Remove draft on save
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true }))
            } catch (err: any) {
              res.statusCode = 500
              res.end(err.message)
            }
          })
          return
        }
        
        res.statusCode = 405
        res.end('Method not allowed')
      })

      server.middlewares.use('/api/draft', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk: any) => { body += chunk.toString() })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              if (!data.path || !data.content) {
                res.statusCode = 400
                return res.end('Missing path or content')
              }
              const absolutePath = path.resolve(__dirname, 'src', data.path)
              drafts.set(absolutePath, data.content)
              
              // Emit file change to Vite watcher to force proper HMR pipeline!
              viteServer.watcher.emit('change', absolutePath)
              
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true }))
            } catch (err: any) {
              res.statusCode = 500
              res.end(err.message)
            }
          })
          return
        }
        res.statusCode = 405
        res.end('Method not allowed')
      })

      server.middlewares.use('/api/list-content', (req: any, res: any) => {
        if (req.method === 'GET') {
          const contentDir = path.resolve(__dirname, 'src', 'content');
          const diagramsDir = path.resolve(__dirname, 'src', 'diagrams');
          const componentsDir = path.resolve(__dirname, 'src', 'components');
          const results: { path: string, name: string, type: string, fullPath?: string }[] = [];
          
          function walk(dir: string, baseType: string, prefix: string) {
            if (!fs.existsSync(dir)) return;
            const files = fs.readdirSync(dir);
            for (const file of files) {
              const fullPath = path.join(dir, file);
              const stat = fs.statSync(fullPath);
              if (stat.isDirectory()) {
                walk(fullPath, baseType || file, prefix);
              } else if (file.endsWith('.mdx') || file.endsWith('.tsx')) {
                const relativePath = path.relative(path.resolve(__dirname, 'src'), fullPath);
                results.push({
                  path: relativePath, // includes prefix like 'content/...'
                  name: file,
                  type: baseType || path.dirname(relativePath).split(path.sep)[1] || prefix,
                  fullPath
                });
              }
            }
          }
          
          walk(contentDir, '', 'content');
          walk(diagramsDir, 'diagrams', 'diagrams');
          walk(componentsDir, 'components', 'components');

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(results));
          return;
        }
        res.statusCode = 405
        res.end('Method not allowed')
      })
    },
    load(id: string) {
      const cleanId = id.split('?')[0]
      if (drafts.has(cleanId)) {
        return drafts.get(cleanId)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    editorAPI(),
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        providerImportSource: "@mdx-js/react"
      }),
    },
    react(),
    tailwindcss(),
  ],
})
