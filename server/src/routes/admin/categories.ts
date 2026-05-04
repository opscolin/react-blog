import { Router, Response } from 'express';
import { sql } from '../../db';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import slugify from 'slugify';

const router = Router();
router.use(authMiddleware);

router.get('/', async (_: AuthRequest, res: Response) => {
  const categories = await sql`SELECT * FROM categories ORDER BY name`;
  res.json(categories);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Name required' });
    return;
  }

  let slug = slugify(name, { lower: true, strict: true });
  if (!slug) {
    slug = `${name.charAt(0)}-${Date.now()}`;
  }
  const existingResult = await sql`SELECT id FROM categories WHERE slug = ${slug}`;
  if (existingResult.length > 0) {
    res.status(400).json({ error: 'Category with this name already exists' });
    return;
  }

  const insertResult = await sql`
    INSERT INTO categories (name, slug)
    VALUES (${name}, ${slug})
    RETURNING *
  `;
  res.status(201).json(insertResult[0]);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const { id } = req.params;

  const existingResult = await sql`SELECT * FROM categories WHERE id = ${id}`;
  const existing = existingResult[0];
  if (!existing) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  const slug = name ? slugify(name, { lower: true, strict: true }) : existing.slug;
  const finalSlug = slug || existing.slug;

  await sql`
    UPDATE categories SET name = ${name || existing.name}, slug = ${finalSlug}
    WHERE id = ${id}
  `;
  const updatedResult = await sql`SELECT * FROM categories WHERE id = ${id}`;
  res.json(updatedResult[0]);
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existingResult = await sql`SELECT id FROM categories WHERE id = ${id}`;
  if (existingResult.length === 0) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  await sql`UPDATE articles SET category_id = NULL WHERE category_id = ${id}`;
  await sql`DELETE FROM categories WHERE id = ${id}`;
  res.json({ success: true });
});

export default router;