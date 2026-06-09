"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const UPLOADS_DIR = path_1.default.join(__dirname, "../uploads");
if (!fs_1.default.existsSync(UPLOADS_DIR))
    fs_1.default.mkdirSync(UPLOADS_DIR, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        const ok = /^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype);
        cb(ok ? null : new Error("Faqat rasm fayllari (jpeg, png, webp)"), ok);
    },
});
/* POST /api/upload — upload single image, returns { url } */
router.post("/", auth_1.authenticate, upload.single("file"), (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: "Fayl yuklanmadi" });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
});
exports.default = router;
