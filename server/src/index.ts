import express from 'express';
import cors from 'cors';
import { initDatabase } from './db';
import authRoutes from './routes/auth';
import articlesRoutes from './routes/articles';
import categoriesRoutes from './routes/categories';
import tagsRoutes from './routes/tags';
import archivesRoutes from './routes/archives';
import settingsRoutes from './routes/settings';
import adminArticleRoutes from './routes/admin/articles';
import adminCategoryRoutes from './routes/admin/categories';
import adminTagRoutes from './routes/admin/tags';
import adminSettingsRoutes from './routes/admin/settings';
import sitemap from './routes/sitemap';
import rss from './routes/rss';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

initDatabase().catch(err => {
  console.error('Database initialization error:', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/archives', archivesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin/articles', adminArticleRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/tags', adminTagRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/sitemap.xml', sitemap);
app.use('/rss.xml', rss);

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;