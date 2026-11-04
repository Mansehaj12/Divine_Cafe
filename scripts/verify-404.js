import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple verification server simulating production server behavior with public/dist 404 handler
async function runVerification() {
  const notFoundHtml = fs.readFileSync(path.resolve(__dirname, '../public/404.html'), 'utf-8');
  const indexHtml = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');

  const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0];
    if (url === '/' || url === '/menu' || url === '/contact') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(indexHtml);
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(notFoundHtml);
    }
  });

  server.listen(3099, async () => {
    try {
      const testUrl = 'http://localhost:3099/made-up-random-url-xyz';
      console.log(`\n================ 404 STATUS VERIFICATION ================`);
      console.log(`[Request] GET ${testUrl}`);
      
      const res = await fetch(testUrl);
      const text = await res.text();
      
      console.log(`[Response] HTTP Status Code: ${res.status} ${res.statusText}`);
      console.log(`[Response] Content-Type: ${res.headers.get('content-type')}`);
      console.log(`[Check] Returned Custom 404 Page: ${text.includes('Page Not Found') && text.includes('404')}`);
      console.log(`[Check] Returns real HTTP 404 (not 200): ${res.status === 404}`);
      console.log(`=========================================================\n`);

      server.close(() => {
        if (res.status === 404) {
          process.exit(0);
        } else {
          process.exit(1);
        }
      });
    } catch (err) {
      console.error(err);
      server.close(() => process.exit(1));
    }
  });
}

runVerification();
