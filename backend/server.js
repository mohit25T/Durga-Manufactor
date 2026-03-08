import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import leadRoutes from "./routes/lead.routes.js";

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

/* Health Check */

app.get("/", (req, res) => {
    res.send("API is running...");
});

/* Start Server */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});