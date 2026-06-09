"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/* GET /api/edit-requests — owner's requests */
router.get("/", auth_1.authenticate, async (req, res) => {
    try {
        const { rows } = await db_1.pool.query(`SELECT er.*, s.name as stadium_name
       FROM edit_requests er LEFT JOIN stadiums s ON s.id=er.stadium_id
       WHERE er.supervisor_id=$1 ORDER BY er.created_at DESC`, [req.user.id]);
        const mapped = rows.map((r) => ({ ...r, stadiums: { name: r.stadium_name } }));
        res.json(mapped);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
/* POST /api/edit-requests */
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)("owner"), async (req, res) => {
    const { stadium_id, field_name, old_value, new_value } = req.body;
    if (!stadium_id || !field_name || !new_value)
        return res.status(400).json({ error: "Maydonlar kerak" });
    try {
        const { rows } = await db_1.pool.query(`INSERT INTO edit_requests (supervisor_id,stadium_id,field_name,old_value,new_value)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`, [req.user.id, stadium_id, field_name, old_value || null, new_value]);
        res.status(201).json(rows[0]);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
