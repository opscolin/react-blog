"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: 'Username and password required' });
        return;
    }
    const user = db_1.default.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    const valid = bcrypt_1.default.compareSync(password, user.password_hash);
    if (!valid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    const token = (0, auth_1.generateToken)(user.id);
    res.json({
        token,
        user: { id: user.id, username: user.username }
    });
});
router.get('/me', auth_1.authMiddleware, (req, res) => {
    const user = db_1.default.prepare('SELECT id, username, created_at FROM users WHERE id = ?').get(req.userId);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    res.json(user);
});
exports.default = router;
//# sourceMappingURL=auth.js.map