"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const auth_1 = __importDefault(require("./routes/auth"));
const stadiums_1 = __importDefault(require("./routes/stadiums"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const editRequests_1 = __importDefault(require("./routes/editRequests"));
const admin_1 = __importDefault(require("./routes/admin"));
const owner_1 = __importDefault(require("./routes/owner"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const settings_1 = __importDefault(require("./routes/settings"));
const events_1 = __importDefault(require("./routes/events"));
const matchmaking_1 = __importDefault(require("./routes/matchmaking"));
const upload_1 = __importDefault(require("./routes/upload"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({ origin: ["http://localhost:8080", "http://localhost:5173", "http://127.0.0.1:8080"] }));
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
app.use("/api/stadiums", stadiums_1.default);
app.use("/api/bookings", bookings_1.default);
app.use("/api/reviews", reviews_1.default);
app.use("/api/edit-requests", editRequests_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api/owner", owner_1.default);
app.use("/api/notifications", notifications_1.default);
app.use("/api/settings", settings_1.default);
app.use("/api/events", events_1.default);
app.use("/api/matchmaking", matchmaking_1.default);
app.use("/api/upload", upload_1.default);
app.use("/uploads", express_1.default.static(require("path").join(__dirname, "..", "uploads")));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.listen(PORT, async () => {
    try {
        await db_1.pool.query("SELECT 1");
        console.log(`✅ Server: http://localhost:${PORT}`);
        console.log(`✅ DB connected: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    }
    catch (e) {
        console.error("❌ DB connection failed:", e);
    }
});
