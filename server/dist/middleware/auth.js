"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = exports.requireRole = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || "stadiontop_secret";
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({ error: "Token yo'q" });
    try {
        req.user = jsonwebtoken_1.default.verify(token, SECRET);
        next();
    }
    catch {
        res.status(401).json({ error: "Token noto'g'ri" });
    }
};
exports.authenticate = authenticate;
const requireRole = (role) => (req, res, next) => {
    if (!req.user?.roles.includes(role)) {
        return res.status(403).json({ error: "Ruxsat yo'q" });
    }
    next();
};
exports.requireRole = requireRole;
const signToken = (user) => jsonwebtoken_1.default.sign(user, SECRET, { expiresIn: "7d" });
exports.signToken = signToken;
