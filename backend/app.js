import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import projectRoutes from "./routes/protect.routes.js";
import contactRoutes from "./routes/contact.routes.js";

import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

//Cấu hình Helmet để bảo vệ header HTTP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          "https://my-portfolio-fe.onrender.com",
          "http://127.0.0.1:5500",
          "data:",
        ],
        mediaSrc: [
          "'self'",
          "https://my-portfolio-fe.onrender.com",
          "http://127.0.0.1:5500",
        ],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
      },
    },
  })
);

// Cấu hình CORS — chỉ cho phép domain frontend gọi
app.use(
  cors({
    origin: ["https://my-portfolio-fe.onrender.com", "http://127.0.0.1:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//Giới hạn request — mỗi IP chỉ được gửi 100 request / 15 phút
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // tối đa 100 request
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// Tạo lại __dirname do ES Module ("type": "module") ko có dir__name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Static uploads với CORS riêng cho thẻ <img>/<video>

const allowedOrigins = [
  "https://my-portfolio-fe.onrender.com",
  "http://127.0.0.1:5500",
];

app.use(
  "/uploads",
  (req, res, next) => {
    const origin = req.get("Origin");
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Cross-Origin-Resource-Policy", "cross-origin");
    }
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

//routers
app.use("/api/projects", projectRoutes);
app.use("/api/contacts", contactRoutes);

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
