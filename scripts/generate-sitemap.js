import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://divinecafe.in';
const currentDate = new Date().toISOString().split('T')[0];

// Only public, indexable pages. Exclude admin, login, thank-you, kitchen and test pages.
const publicRoutes = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'daily'
  },
  {
    path: '/menu',
    priority: '0.9',
    changefreq: 'weekly'
  },
  {
    path: '/contact',
    priority: '0.8',
    changefreq: 'monthly'
  }
];

function generateSitemapXml() {
  const urlsXml = publicRoutes
    .map(
      (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;
}

const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, generateSitemapXml(), 'utf-8');
console.log(`✅ Sitemap successfully generated at: ${outputPath} (${publicRoutes.length} public URLs)`);
