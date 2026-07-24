import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'

import rehypeKatex from 'rehype-katex'

import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { visualizer } from 'rollup-plugin-visualizer';
import {
  createEditorApiHandlers,
  handleEditorApiRequest,
} from './scripts/editor/editorApiRoutes';

/**
 * Plugin personalizado de Vite (`editorAPI`) para Matematika.
 * Intercepta peticiones al servidor de desarrollo para proporcionar una API REST
 * ligera (lectura/escritura/listado) que permite al Editor Web modificar
 * archivos locales (.mdx, .tsx) y usar el HMR de Vite para Live Preview.
 */
const diagramParserContractFiles = new Set([
  path.resolve(__dirname, 'scripts/editor/parseDiagramSourceAST.ts'),
  path.resolve(__dirname, 'src/features/editor/diagrams/model.ts'),
  path.resolve(__dirname, 'src/features/editor/diagrams/model/angleConstraints.ts'),
  path.resolve(__dirname, 'src/features/editor/diagrams/model/constraintOptions.ts'),
  path.resolve(__dirname, 'src/features/editor/diagrams/source/generator.ts'),
  path.resolve(__dirname, 'src/features/editor/diagrams/source/parser.ts'),
  path.resolve(__dirname, 'src/shared/diagrams/spec/migrations.ts'),
  path.resolve(__dirname, 'src/shared/diagrams/spec/scene.ts'),
  path.resolve(__dirname, 'src/shared/diagrams/spec/schema.ts'),
  path.resolve(__dirname, 'src/shared/diagrams/spec/types.ts'),
].map(filePath => path.normalize(filePath)));

function editorAPI(): Plugin {
  return {
    name: 'editor-api',
    enforce: 'pre' as const,
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      server.watcher.add([...diagramParserContractFiles]);
      server.watcher.on('change', changedPath => {
        if (diagramParserContractFiles.has(path.normalize(changedPath))) {
          server.restart().catch(error => server.config.logger.error(
            `No se pudo reiniciar Vite tras cambiar el parser de diagramas: ${error instanceof Error ? error.message : String(error)}`,
          ));
        }
      });

      const handlers = createEditorApiHandlers({ projectRoot: __dirname });

      const mount = (routePrefix: string) => {
        server.middlewares.use(routePrefix, async (req: IncomingMessage, res: ServerResponse) => {
          const url = new URL(req.url || '/', `http://${req.headers.host ?? 'localhost'}`);
          const pathname = `${routePrefix}${url.pathname === '/' ? '' : url.pathname}`;
          const handled = await handleEditorApiRequest(req, res, pathname, handlers);
          if (!handled) {
            res.statusCode = 404;
            res.end('Not found');
          }
        });
      };

      mount('/api/content/parse-diagram');
      mount('/api/content/update-imports-exports');
      mount('/api/content/restore');
      mount('/api/content');
      mount('/api/draft');
      mount('/api/list-content');
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    editorAPI(),
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
      '@': path.resolve(__dirname, './src')
    }
  },
  base: "/Matematika/"
})
