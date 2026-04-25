"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.get('/', (_, res) => {
    const settings = {};
    const rows = db_1.default.prepare('SELECT key, value FROM settings').all();
    rows.forEach(row => {
        try {
            settings[row.key] = JSON.parse(row.value);
        }
        catch {
            settings[row.key] = row.value;
        }
    });
    res.json(settings);
});
exports.default = router;
//# sourceMappingURL=settings.js.map