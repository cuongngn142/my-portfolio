import Contact from "../models/contact.model.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const saved = await contact.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const result = await Contact.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result.modifiedCount === 0)
      return res
        .status(404)
        .json({ message: "Contact not found or no change" });
    res.json({ message: "Contact updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const result = await Contact.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateContactStatus = async (req, res) => {
  const { status } = req.body;
  if (!["new", "read", "replied", "closed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const result = await Contact.updateOne(
      { _id: req.params.id },
      { $set: { status } }
    );
    if (result.modifiedCount === 0)
      return res
        .status(404)
        .json({ message: "Contact not found or no change" });
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
