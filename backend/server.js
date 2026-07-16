import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

dotenv.config();

const app = express();

/* Connect Database */

connectDB();

/* Middlewares */

app.use(cors());
app.use(express.json());

/* Routes */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/settings", settingsRoutes);

/* Health Check */

app.get("/", (req, res) => {
    res.send("API is running...");
});

/* Global Error Handler */

app.use((err, req, res, next) => {
    console.error("❌ UNHANDLED BACKEND ERROR:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

/* Start Server */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});