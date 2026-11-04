import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// In-memory order sync store for live multi-device kitchen routing
let memoryOrders = [];

function custom404Plugin() {
  const validPages = new Set([
    '/',
    '',
    '/index.html',
    '/menu',
    '/contact',
    '/location',
    '/qr-standee.html',
    '/manifest.json',
    '/sw.js',
    '/robots.txt',
    '/sitemap.xml',
    '/pwa-icon.svg'
  ]);

  const handle404 = (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }

    const urlPath = req.url.split('?')[0];

    // Allowed dev/asset prefixes and static file extensions
    if (
      urlPath.startsWith('/@') ||
      urlPath.startsWith('/src/') ||
      urlPath.startsWith('/node_modules/') ||
      urlPath.startsWith('/dishes/') ||
      urlPath.startsWith('/assets/') ||
      urlPath.startsWith('/api/') ||
      /\.(js|jsx|ts|tsx|css|svg|png|jpg|jpeg|gif|webp|ico|json|woff|woff2|ttf|map)$/i.test(urlPath)
    ) {
      return next();
    }

    // If it's a known valid public page, continue normally
    if (validPages.has(urlPath)) {
      return next();
    }

    // For any made-up / non-existent route, return custom 404 page with real HTTP 404 status
    try {
      const notFoundPath = path.resolve(__dirname, 'public/404.html');
      if (fs.existsSync(notFoundPath)) {
        const notFoundHtml = fs.readFileSync(notFoundPath, 'utf-8');
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(notFoundHtml);
        return;
      }
    } catch (err) {
      // Fallback
    }

    res.statusCode = 404;
    res.end('404 Not Found');
  };

  return {
    name: 'custom-404-handler',
    configureServer(server) {
      server.middlewares.use(handle404);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle404);
    }
  };
}

function ordersApiPlugin() {
  return {
    name: 'orders-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/orders')) {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(memoryOrders));
            return;
          }
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const newOrder = JSON.parse(body);
                memoryOrders = [newOrder, ...memoryOrders.filter(o => o.id !== newOrder.id)];
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, order: newOrder }));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }
          if (req.method === 'PATCH' || req.method === 'PUT') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const update = JSON.parse(body);
                memoryOrders = memoryOrders.map(o => o.id === update.id ? { ...o, ...update } : o);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), ordersApiPlugin(), custom404Plugin()],
  server: {
    port: 3000,
    open: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js'
  }
});
