"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/* Auto-create notifications table */
db_1.pool.query(`
  CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    meta JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`).catch(() => { });
/* GET /api/notifications — current user's notifications */
router.get("/", auth_1.authenticate, async (req, res) => {
    try {
        const { rows } = await db_1.pool.query(`SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50`, [req.user.id]);
        res.json(rows);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
/* PATCH /api/notifications/:id/read */
router.patch("/:id/read", auth_1.authenticate, async (req, res) => {
    try {
        await db_1.pool.query("UPDATE notifications SET is_read=TRUE WHERE id=$1 AND user_id=$2", [req.params.id, req.user.id]);
        res.json({ ok: true });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
/* PATCH /api/notifications/read-all */
router.patch("/read-all", auth_1.authenticate, async (req, res) => {
    try {
        await db_1.pool.query("UPDATE notifications SET is_read=TRUE WHERE user_id=$1", [req.user.id]);
        res.json({ ok: true });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
