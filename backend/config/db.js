import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected via Mongoose!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

/*
Có 2 loại 1 là driver thuần là connect trược tiếp collection
2 là connect thông qua model và model connect tới collection và có nhiều chức năng nâng cao hơn
*/
