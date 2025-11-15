import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import checkApiKey from "../middleware/checkApiKey.js";
import authenticateToken from "../middleware/authenticateToken.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", authenticateToken, authorize("admin"), createProject);
router.put("/:id", authenticateToken, authorize("admin"), updateProject);
router.delete("/:id", authenticateToken, authorize("admin"), deleteProject);

export default router;
