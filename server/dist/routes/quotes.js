"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get('/random', async (req, res) => {
    try {
        const settingsRows = await (0, db_1.sql) `SELECT value FROM settings WHERE key = 'enable_quote_cache'`;
        const enableQuoteCache = settingsRows[0]?.value === 'true';
        if (enableQuoteCache) {
            const redis = await (0, db_1.getRedis)();
            if (redis) {
                const cached = await redis.get('quote:random');
                if (cached) {
                    res.json(JSON.parse(cached));
                    return;
                }
                const quotes = await (0, db_1.sql) `SELECT id, content FROM quotes ORDER BY RANDOM() LIMIT 1`;
                if (quotes[0]) {
                    await redis.setEx('quote:random', 3600, JSON.stringify(quotes[0]));
                    res.json(quotes[0]);
                    return;
                }
            }
        }
        const quotes = await (0, db_1.sql) `SELECT id, content FROM quotes ORDER BY RANDOM() LIMIT 1`;
        if (quotes[0]) {
            res.json(quotes[0]);
        }
        else {
            res.status(404).json({ error: 'No quotes found' });
        }
    }
    catch (error) {
        console.error('Error fetching random quote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=quotes.js.map