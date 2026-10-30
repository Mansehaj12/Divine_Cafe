import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In-memory order sync store for live multi-device kitchen routing
let memoryOrders = [];

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
  plugins: [react(), ordersApiPlugin()],
  server: {
    port: 3000,
    open: true
  }
});
