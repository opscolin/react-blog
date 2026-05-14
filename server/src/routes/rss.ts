import { Router } from 'express';
import { sql } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://yourblog.com';
  const blogTitle = process.env.BLOG_TITLE || 'My Blog';

  const articles = await sql`
    SELECT a.title, a.slug, a.excerpt, a.content, a.created_at, c.name as category_name
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.status = 'published'
    ORDER BY a.created_at DESC
    LIMIT 20
  `;

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  xml += '  <channel>\n';
  xml += `    <title>${escapeXml(blogTitle)}</title>\n`;
  xml += `    <link>${baseUrl}</link>\n`;
  xml += `    <description>${escapeXml(blogTitle)} RSS Feed</description>\n`;
  xml += `    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>\n`;
  xml += `    <language>zh-CN</language>\n`;

  for (const article of articles) {
    const description = article.excerpt || article.content?.substring(0, 200) || '';
    const pubDate = new Date(article.created_at).toUTCString();
    xml += '    <item>\n';
    xml += `      <title>${escapeXml(article.title)}</title>\n`;
    xml += `      <link>${baseUrl}/article/${article.slug}</link>\n`;
    xml += `      <guid isPermaLink="true">${baseUrl}/article/${article.slug}</guid>\n`;
    xml += `      <pubDate>${pubDate}</pubDate>\n`;
    xml += `      <description>${escapeXml(description)}</description>\n`;
    if (article.category_name) {
      xml += `      <category>${escapeXml(article.category_name)}</category>\n`;
    }
    xml += '    </item>\n';
  }

  xml += '  </channel>\n';
  xml += '</rss>';

  res.set('Content-Type', 'application/rss+xml');
  res.send(xml);
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default router;
