import { Pool, types } from "pg";
import dotenv from "dotenv";
dotenv.config();

// Return DATE columns as plain "YYYY-MM-DD" strings (no timezone conversion)
types.setTypeParser(types.builtins.DATE, (val: string) => val);

// Railway/production: bitta DATABASE_URL bo'lsa o'shani ishlatadi.
// Lokal: alohida DB_* o'zgaruvchilardan foydalanadi.
export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "stadiontop",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
    });

pool.on("error", (err) => {
  console.error("DB connection error:", err);
});
