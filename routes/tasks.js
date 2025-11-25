import express from "express"; 
import { createTask, deleteTask, getAllTasks, toggleTaskStatus, updateTask } from "../controllers/tasks.js";
import isVerifiyed from "../middleware/userIdentify.js";

const router = express.Router();
router.route("/tasks").post(isVerifiyed, createTask).get(isVerifiyed, getAllTasks);
router.route("/tasks/:id").put(isVerifiyed, updateTask).delete(isVerifiyed, deleteTask);
router.patch("/tasks/:id/toggle", isVerifiyed, toggleTaskStatus);

export default router;