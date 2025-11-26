
import express from "express"; 
import { createTask, deleteTask, getAllTasks, toggleTaskStatus, updateTask } from "../controllers/tasks.js";
import isVerified from "../middleware/userIdentify.js";

const router = express.Router();
router.route("/tasks").post(isVerified, createTask).get(isVerified, getAllTasks);
router.route("/tasks/:id").put(isVerified, updateTask).delete(isVerified, deleteTask);
router.patch("/tasks/:id/toggle", isVerified, toggleTaskStatus);

export default router;