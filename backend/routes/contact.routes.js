import express from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  updateContactStatus,
} from "../controllers/contact.controller.js";
import checkApiKey from "../middleware/checkApiKey.js";
const router = express.Router();

router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.post("/", checkApiKey, createContact);
router.put("/:id", checkApiKey, updateContact);
router.delete("/:id", checkApiKey, deleteContact);
router.put("/:id/status", checkApiKey, updateContactStatus);
export default router;

/*
Giới hạn rate limit api cotact
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "You can only send 5 contact messages per 10 minutes.",
});

app.use("/api/contacts", contactLimiter, contactRoutes);

*/
