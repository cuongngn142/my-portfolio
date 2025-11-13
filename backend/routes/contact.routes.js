import express from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  updateContactStatus,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.post("/", createContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);
router.put("/:id/status", updateContactStatus);
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
