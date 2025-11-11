import Project from "../models/project.model.js";

// Lấy tất cả projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy project theo id
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo project mới
export const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật project
export const updateProject = async (req, res) => {
  try {
    const result = await Project.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result.modifiedCount === 0)
      return res
        .status(404)
        .json({ message: "Project not found or no change" });
    res.json({ message: "Project updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa project
export const deleteProject = async (req, res) => {
  try {
    const result = await Project.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
