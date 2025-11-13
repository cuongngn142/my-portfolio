import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import checkApiKey from "../middleware/checkApiKey.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", checkApiKey, createProject);
router.put("/:id", checkApiKey, updateProject);
router.delete("/:id", checkApiKey, deleteProject);

export default router;
