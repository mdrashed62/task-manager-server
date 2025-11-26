
import { Task } from "../models/tasks.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    console.log("Create task request body:", req.body); 
    console.log("User ID from token:", req.userId);

    if (!title || !description || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      user: req.userId,
    });

    console.log("📝 Created task:", task);

    return res.status(201).json({
      success: true,
      message: "Task successfully created.",
      task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const status = req.query.status;
    let filter = { user: req.userId };

    console.log("Fetching tasks for user:", req.userId);

    if (status === "completed") {
      filter.status = "completed";
    } else if (status === "pending") {
      filter.status = "pending";
    }

    const tasks = await Task.find(filter);

    console.log("Tasks found:", tasks.length);

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Error in getAllTasks:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, status } = req.body;

    const task = await Task.findOne({ _id: id, user: req.userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or access denied.",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      updatedTask,
      message: `${updatedTask.title} has been updated successfully.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required.",
      });
    }

    const task = await Task.findOne({ _id: id, user: req.userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or access denied.",
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Task successfully deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

export const toggleTaskStatus = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await Task.findOne({ _id: id, user: req.userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or access denied.",
      });
    }

    const newStatus = task.status === "completed" ? "pending" : "completed";

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      updatedTask,
      message: `Task status changed to ${newStatus}.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};
