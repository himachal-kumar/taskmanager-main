import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
  TaskData,
  getTotalTasks,
  deleteTask,
  getTrashTasks,
} from "../controllers/taskController.js";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";

const router = express.Router();

// First, define all specific routes (non-parameterized routes)
router.get("/totaltask", getTotalTasks);
router.get("/tasks", getTasks);
router.get("/dashboard", protectRoute, dashboardStatistics);

// Task creation route
router.post("/create", createTask);

// Task update routes
router.put("/update/:id", updateTask);
router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);

// Task delete routes
router.delete("/delete/:id", deleteTask);  // Regular delete
router.get("/trash", getTrashTasks);  // Route to get trashed tasks
router.put("/trash/:id", trashTask);  // Route to move task to trash
router.delete("/delete-restore/:id", deleteRestoreTask);  // Route to restore/delete from trash

// Task management routes
router.post("/duplicate/:id", duplicateTask);
router.post("/activity/:id", postTaskActivity);

// Finally, put the generic route last to avoid catching other routes
router.get("/:id", getTask);

export default router;

