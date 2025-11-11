import mongoose from "mongoose";
import { type } from "os";

// Schema cho collection "projects"
const projectSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    urlImage: { type: String },
    projectTimeline: { type: String },
    role: { type: String },
    technology: { type: String },
    mainFeatures: [String],
    urlDemo: { type: String },
    urlSource: { type: String },
    urlVideoDemo: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    strict: false,
    collection: "projects",
  }
);

// Model Mongoose
const Project = mongoose.model("Project", projectSchema);

export default Project;
