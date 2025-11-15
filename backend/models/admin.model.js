import mongoose from "mongoose";
import hashPassword from "../middleware/hashPassword.js";

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "admins",
  }
);

adminSchema.pre("save", hashPassword);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;

/*
.pre() trong Mongoose
Định nghĩa: Middleware chạy trước một hành động (save, validate, remove, updateOne…) trên schema.
Cú pháp:

schema.pre('save', function(next) {
  // 'this' là document sắp lưu
  next(); // tiếp tục quá trình
});

Tham số next:
Do Mongoose tự truyền, bạn không cần tự truyền khi khai báo middleware.
next() → tiếp tục hành động
next(err) → báo lỗi, document không được lưu
Các hook phổ biến:
pre('save') → trước khi lưu document
pre('validate') → trước khi validate
pre('remove') → trước khi xóa document
pre('updateOne') / pre('findOneAndUpdate') → trước khi update
*/
