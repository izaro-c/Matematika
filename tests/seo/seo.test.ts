import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getSiteUrl, getAbsoluteUrl } from '@/lib/seo/siteUrl';
import { generateSitemapAndRobots } from '../../scripts/core/generate-sitemap-and-robots';

describe('SEO & Metadata Unit Tests', () => {
  it('resuelve correctamente la URL base del sitio web y URLs absolutas', () => {
    const siteUrl = getSiteUrl();
    expect(siteUrl).toBeDefined();
    expect(siteUrl.startsWith('http')).toBe(true);
    expect(siteUrl.endsWith('/')).toBe(false);

    const absUrl = getAbsoluteUrl('/es/teorema/pitagoras');
    expect(absUrl).toBe(`${siteUrl}/es/teorema/pitagoras`);
  });

  it('genera sitemap.xml y robots.txt válidos excluyendo las rutas de editor', () => {
    generateSitemapAndRobots();

    const sitemapPath = path.resolve('./public/sitemap.xml');
    const robotsPath = path.resolve('./public/robots.txt');

    expect(fs.existsSync(sitemapPath)).toBe(true);
    expect(fs.existsSync(robotsPath)).toBe(true);

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');

    // Verificar robots.txt
    expect(robotsContent).toContain('Disallow: /editor');
    expect(robotsContent).toContain('Disallow: /*/editor');
    expect(robotsContent).toContain('Sitemap:');

    // Verificar sitemap.xml
    expect(sitemapContent).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('<loc>');
    expect(sitemapContent).toContain('hreflang="es"');
    expect(sitemapContent).toContain('hreflang="x-default"');

    // NUNCA debe contener rutas de editor en el sitemap
    expect(sitemapContent).not.toContain('/editor');
    expect(sitemapContent).not.toContain('/es/editor');
    expect(sitemapContent).not.toContain('/eu/editor');
  });
});
