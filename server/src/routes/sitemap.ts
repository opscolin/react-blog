import { Router } from 'express';
import { sql } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://yourblog.com';

  const articles = await sql`
    SELECT slug, created_at, updated_at FROM articles WHERE status = 'published' ORDER BY created_at DESC
  `;

  const categories = await sql`
    SELECT slug FROM categories
  `;

  const tags = await sql`
    SELECT name FROM tags
  `;

  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/archive', changefreq: 'weekly', priority: '0.8' },
    { url: '/about', changefreq: 'monthly', priority: '0.5' },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  for (const cat of categories) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/category/${cat.slug}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  }

  for (const tag of tags) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/tag/${encodeURIComponent(tag.name)}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  }

  for (const article of articles) {
    const lastmod = article.updated_at ? new Date(article.updated_at).toISOString().split('T')[0] : new Date(article.created_at).toISOString().split('T')[0];
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/article/${article.slug}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += '</urlset>';

  res.set('Content-Type', 'text/xml');
  res.send(xml);
});

export default router;