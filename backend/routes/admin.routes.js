import express from "express";
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  checkAccount,
  getAccountByName,
} from "../controllers/admin.controller.js";
import authenticateToken from "../middleware/authenticateToken.js";
import authorize from "../middleware/authorize.js";
const router = express.Router();

router.get("/", authenticateToken, authorize("admin"), getAllAccounts);
router.get("/id/:id", authenticateToken, authorize("admin"), getAccountById);
router.get("/username/:username", getAccountByName);
router.post("/", createAccount);
router.put("/:id", authenticateToken, authorize("admin"), updateAccount);
router.delete("/:id", authenticateToken, authorize("admin"), deleteAccount);
router.post("/login", checkAccount);

export default router;
