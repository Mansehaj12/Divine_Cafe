import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Pre-Launch SEO & Checklist Verification', () => {
  it('custom 404 page exists and contains helpful navigation links', () => {
    const notFoundPath = path.resolve(__dirname, '../../public/404.html');
    expect(fs.existsSync(notFoundPath)).toBe(true);

    const content = fs.readFileSync(notFoundPath, 'utf-8');
    expect(content).toContain('404');
    expect(content).toContain('Page Not Found');
    expect(content).toContain('Return to Homepage');
    expect(content).toContain('Browse Digital Menu');
  });

  it('robots.txt allows crawling and does NOT contain leftover Disallow: /', () => {
    const robotsPath = path.resolve(__dirname, '../../public/robots.txt');
    expect(fs.existsSync(robotsPath)).toBe(true);

    const robots = fs.readFileSync(robotsPath, 'utf-8');
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    // Ensure it does NOT have bare "Disallow: /" (which would block the entire site)
    const lines = robots.split('\n').map(l => l.trim());
    expect(lines).not.toContain('Disallow: /');
    expect(robots).toContain('Sitemap: https://divinecafe.in/sitemap.xml');
  });

  it('sitemap.xml exists and includes all public pages with canonical URLs', () => {
    const sitemapPath = path.resolve(__dirname, '../../public/sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
    expect(sitemap).toContain('<loc>https://divinecafe.in/</loc>');
    expect(sitemap).toContain('<loc>https://divinecafe.in/menu</loc>');
    expect(sitemap).toContain('<loc>https://divinecafe.in/contact</loc>');
    // Exclude internal routes
    expect(sitemap).not.toContain('/kitchen');
    expect(sitemap).not.toContain('/api');
  });

  it('index.html has unique descriptive title and meta description without keyword stuffing', () => {
    const indexPath = path.resolve(__dirname, '../../index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');
    
    expect(indexHtml).toContain('<title>Divine Cafe | Pure Vegetarian Café in Baradari Garden, Patiala</title>');
    expect(indexHtml).toContain('name="description"');
    expect(indexHtml).toContain('upgrade-insecure-requests'); // Strict HTTPS enforcement
  });
});
