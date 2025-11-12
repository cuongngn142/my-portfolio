import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "replied", "closed"], default: "new" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "contacts",
  }
);

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
