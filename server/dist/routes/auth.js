import { Router } from 'express';
import bcrypt from 'bcrypt';
import { sql } from '../db';
import { authMiddleware, generateToken } from '../middleware/auth';
const router = Router();
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: 'Username and password required' });
        return;
    }
    const userResult = await sql `
    SELECT * FROM users WHERE username = ${username}
  `;
    const user = userResult[0];
    if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    const token = generateToken(user.id);
    res.json({
        token,
        user: { id: user.id, username: user.username }
    });
});
router.get('/me', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const userResult = await sql `
    SELECT id, username, created_at FROM users WHERE id = ${userId}
  `;
    const user = userResult[0];
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    res.json(user);
});
export default router;
//# sourceMappingURL=auth.js.map