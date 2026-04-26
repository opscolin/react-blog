import { Router } from 'express';
import { sql } from '../../db';
import { authMiddleware } from '../../middleware/auth';
import slugify from 'slugify';
const router = Router();
router.use(authMiddleware);
router.get('/', async (_, res) => {
    const categories = await sql `SELECT * FROM categories ORDER BY name`;
    res.json(categories);
});
router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Name required' });
        return;
    }
    const slug = slugify(name, { lower: true, strict: true });
    const existingResult = await sql `SELECT id FROM categories WHERE slug = ${slug}`;
    if (existingResult.length > 0) {
        res.status(400).json({ error: 'Category with this name already exists' });
        return;
    }
    const insertResult = await sql `
    INSERT INTO categories (name, slug)
    VALUES (${name}, ${slug})
    RETURNING *
  `;
    res.status(201).json(insertResult[0]);
});
router.put('/:id', async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const existingResult = await sql `SELECT * FROM categories WHERE id = ${id}`;
    const existing = existingResult[0];
    if (!existing) {
        res.status(404).json({ error: 'Category not found' });
        return;
    }
    const slug = name ? slugify(name, { lower: true, strict: true }) : existing.slug;
    await sql `
    UPDATE categories SET name = ${name || existing.name}, slug = ${slug}
    WHERE id = ${id}
  `;
    const updatedResult = await sql `SELECT * FROM categories WHERE id = ${id}`;
    res.json(updatedResult[0]);
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const existingResult = await sql `SELECT id FROM categories WHERE id = ${id}`;
    if (existingResult.length === 0) {
        res.status(404).json({ error: 'Category not found' });
        return;
    }
    await sql `UPDATE articles SET category_id = NULL WHERE category_id = ${id}`;
    await sql `DELETE FROM categories WHERE id = ${id}`;
    res.json({ success: true });
});
export default router;
//# sourceMappingURL=categories.js.map