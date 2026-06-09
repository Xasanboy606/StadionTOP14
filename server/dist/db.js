"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Return DATE columns as plain "YYYY-MM-DD" strings (no timezone conversion)
pg_1.types.setTypeParser(pg_1.types.builtins.DATE, (val) => val);
// Railway/production: bitta DATABASE_URL bo'lsa o'shani ishlatadi.
// Lokal: alohida DB_* o'zgaruvchilardan foydalanadi.
exports.pool = process.env.DATABASE_URL
    ? new pg_1.Pool({ connectionString: process.env.DATABASE_URL })
    : new pg_1.Pool({
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME || "stadiontop",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
    });
exports.pool.on("error", (err) => {
    console.error("DB connection error:", err);
});
