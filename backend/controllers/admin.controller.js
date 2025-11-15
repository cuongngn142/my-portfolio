import Admin from "../models/admin.model.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Admin.find().select("_id username role createdAt");
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAccountById = async (req, res) => {
  try {
    const account = await Admin.findById(req.params.id).select(
      "_id username role createdAt"
    );
    if (!account) res.status(404).json({ message: "Account not found" });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAccountByName = async (req, res) => {
  try {
    const account = await Admin.findOne({
      username: req.params.username,
    }).select("username");
    if (!account) return res.json({ message: "Account not exists" });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    const account = new Admin(req.body);
    const saved = await account.save(); //lưu vào collection
    // res.status(201).json(saved); save chưa all dữ liệu có cả pass
    res.status(201).json({
      message: "Account created",
      user: {
        id: saved._id,
        username: saved.username,
        role: saved.role,
        createdAt: saved.createdAt,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const result = await Admin.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result.modifiedCount === 0)
      return res
        .status(404)
        .json({ message: "Account not found or no change" });
    res.json({ message: "Account updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const result = await Admin.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Account not found" });
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkAccount = async (req, res) => {
  try {
    const account = req.body;
    const result = await Admin.findOne({ username: account.username });
    if (!result) return res.status(404).json({ message: "Account not found" });
    const isMatch = await bcrypt.compare(account.password, result.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });
    const token = jsonwebtoken.sign(
      {
        id: result._id,
        username: result.username,
        role: result.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ message: "Login successfully", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
