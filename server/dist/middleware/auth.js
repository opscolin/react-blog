import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'blog-secret-key-change-in-production';
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}
export function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}
//# sourceMappingURL=auth.js.map