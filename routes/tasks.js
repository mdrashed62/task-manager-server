import express from "express"; 
import { createTask, deleteTask, getAllTasks, toggleTaskStatus, updateTask } from "../controllers/tasks.js";

const router = express.Router();
router.route("/tasks").post(createTask).get(getAllTasks);
router.route("/tasks/:id").put(updateTask).delete(deleteTask);
router.patch("/tasks/:id/toggle", toggleTaskStatus);

export default router;