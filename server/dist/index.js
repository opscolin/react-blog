"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const auth_1 = __importDefault(require("./routes/auth"));
const articles_1 = __importDefault(require("./routes/articles"));
const categories_1 = __importDefault(require("./routes/categories"));
const tags_1 = __importDefault(require("./routes/tags"));
const archives_1 = __importDefault(require("./routes/archives"));
const settings_1 = __importDefault(require("./routes/settings"));
const articles_2 = __importDefault(require("./routes/admin/articles"));
const categories_2 = __importDefault(require("./routes/admin/categories"));
const tags_2 = __importDefault(require("./routes/admin/tags"));
const settings_2 = __importDefault(require("./routes/admin/settings"));
const sitemap_1 = __importDefault(require("./routes/sitemap"));
const rss_1 = __importDefault(require("./routes/rss"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.initDatabase)().catch(err => {
    console.error('Database initialization error:', err);
});
app.use('/api/auth', auth_1.default);
app.use('/api/articles', articles_1.default);
app.use('/api/categories', categories_1.default);
app.use('/api/tags', tags_1.default);
app.use('/api/archives', archives_1.default);
app.use('/api/settings', settings_1.default);
app.use('/api/admin/articles', articles_2.default);
app.use('/api/admin/categories', categories_2.default);
app.use('/api/admin/tags', tags_2.default);
app.use('/api/admin/settings', settings_2.default);
app.use('/sitemap.xml', sitemap_1.default);
app.use('/rss.xml', rss_1.default);
app.get('/api/health', (_, res) => {
    res.json({ status: 'ok' });
});
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
module.exports = app;
//# sourceMappingURL=index.js.map