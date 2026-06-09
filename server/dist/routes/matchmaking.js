"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/* Auto-create table if not exists */
db_1.pool.query(`
  CREATE TABLE IF NOT EXISTS matchmaking_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name TEXT,
    type TEXT NOT NULL CHECK (type IN ('needPlayers', 'challenge')),
    message TEXT NOT NULL,
    contact TEXT NOT NULL,
    district TEXT,
    hour INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE INDEX IF NOT EXISTS idx_matchmaking_created ON matchmaking_posts(created_at DESC);
`).catch(() => { });
/* GET /api/matchmaking — list latest 50 posts */
router.get("/", async (_req, res) => {
    try {
        const { rows } = await db_1.pool.query(`SELECT mp.*, p.full_name AS profile_name
       FROM matchmaking_posts mp
       LEFT JOIN profiles p ON mp.user_id = p.id
       ORDER BY mp.created_at DESC
       LIMIT 50`);
        res.json(rows);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
/* POST /api/matchmaking — create post (auth required) */
router.post("/", auth_1.authenticate, async (req, res) => {
    const { type, message, contact, district, hour } = req.body;
    if (!type || !message?.trim() || !contact?.trim()) {
        return res.status(400).json({ error: "Tur, xabar va aloqa ma'lumoti talab etiladi" });
    }
    if (!["needPlayers", "challenge"].includes(type)) {
        return res.status(400).json({ error: "Noto'g'ri tur" });
    }
    try {
        const authorName = req.user?.full_name || req.user?.email || null;
        const { rows } = await db_1.pool.query(`INSERT INTO matchmaking_posts (user_id, author_name, type, message, contact, district, hour)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`, [req.user.id, authorName, type, message.trim(), contact.trim(), district || null, hour ?? null]);
        res.status(201).json(rows[0]);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
/* DELETE /api/matchmaking/:id — delete own post */
router.delete("/:id", auth_1.authenticate, async (req, res) => {
    try {
        const { rows } = await db_1.pool.query("SELECT user_id FROM matchmaking_posts WHERE id=$1", [req.params.id]);
        if (!rows.length)
            return res.status(404).json({ error: "Topilmadi" });
        if (rows[0].user_id !== req.user.id) {
            return res.status(403).json({ error: "Ruxsat yo'q" });
        }
        await db_1.pool.query("DELETE FROM matchmaking_posts WHERE id=$1", [req.params.id]);
        res.json({ ok: true });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
