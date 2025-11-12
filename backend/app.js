import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import projectRoutes from "./routes/protect.routes.js";
import contactRoutes from "./routes/contact.routes.js";

import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

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
