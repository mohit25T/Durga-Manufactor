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
import workflowRoutes from "./routes/workflow.routes.js";

dotenv.config();

const app = express();

/* Connect Database */
connectDB();

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://www.durgamanufactures.com",
  "https://durgamanufactures.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    // Allow configured origins or any local development / LAN origin
    if (
      allowedOrigins.includes(origin) ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin.startsWith("http://192.168.") ||
      origin.startsWith("http://10.0.") ||
      origin.includes("durgamanufactures.com") ||
      origin.includes("onrender.com") ||
      origin.includes("vercel.app")
    ) {
      return callback(null, true);
    }

    console.warn("⚠️ CORS request allowed for origin:", origin);
    return callback(null, true);
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],

  optionsSuccessStatus: 204,
};

/* CORS MUST COME BEFORE ROUTES */
app.use(cors(corsOptions));

/* Body Parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/* =========================
   ROUTES
========================= */



app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/workflow", workflowRoutes);

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Durga Manufactures API is running",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("❌ UNHANDLED BACKEND ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});