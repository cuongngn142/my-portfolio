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
app.use(helmet());

// Cấu hình CORS — chỉ cho phép domain frontend gọi
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "https://my-portfolio-fe.onrender.com"],
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routers
app.use("/api/projects", projectRoutes);
app.use("/api/contacts", contactRoutes);

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
