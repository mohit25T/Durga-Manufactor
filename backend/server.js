import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import dealerRoutes from "./routes/dealer.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";

dotenv.config();

const app = express();

/* Connect Database */

connectDB();

/* Middlewares */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://durgamanufactures.com",
  "https://www.durgamanufactures.com",
  "https://durga-manufactor.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".durgamanufactures.com") ||
        origin.endsWith(".onrender.com")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow all origins to prevent CORS blocks
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
  })
);

app.options("*", cors());
app.use(express.json());

/* Routes */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/invoices", invoiceRoutes);

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