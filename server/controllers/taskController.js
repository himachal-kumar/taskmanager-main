    import Notice from "../models/notification.js";
    import Task from "../models/task.js";
    import User from "../models/user.js";

    export const createTask = async (req, res) => {
      try {
        const { title, date, team, stage, priority, assets, createdBy } = req.body;
        console.log("Creating task with data:", { title, team, stage, priority });

        if (!title || !team || !stage || !priority) {
          return res.status(400).json({
            status: false,
            message: "Missing required fields"
          });
        }

        // Create the task
        const task = await Task.create({
          title,
          date: date || new Date(),
          team,
          stage: stage.toLowerCase(),
          priority: priority.toLowerCase(),
          assets: assets || [],
          createdBy,
          isTrashed: false
        });

        // Create notifications for team members
        const notifications = await Promise.all(
          team.map(async (memberId) => {
            try {
              // Create individual notification for each team member
              return await Notice.create({
                team: [memberId], // Only include the specific team member
                text: `You have been assigned to task: ${title}`,
                task: task._id,
                notiType: "alert",
                isRead: [],
                createdBy
              });
            } catch (notifError) {
              console.error("Error creating notification:", notifError);
              return null;
            }
          })
        );

        // Filter out failed notifications
        const successfulNotifications = notifications.filter(n => n !== null);

        const populatedTask = await Task.findById(task._id)
          .populate('team', 'name email')
          .populate('createdBy', 'name email');

        console.log("Task created:", populatedTask);
        console.log("Notifications created:", successfulNotifications);

        res.status(201).json({
          status: true,
          message: "Task created successfully",
          task: populatedTask,
          notifications: successfulNotifications
        });
      } catch (error) {
        console.error("Task creation error:", error);
        res.status(500).json({
          status: false,
          message: error.message || "Failed to create task"
        });
      }
    };

    export const duplicateTask = async (req, res) => {
      try {
        const { id } = req.params;

        const task = await Task.findById(id);
        if (!task) {
          return res.status(404).json({ status: false, message: "Task not found." });
        }

        const newTask = await Task.create({
          ...task.toObject(), // Use toObject() to copy properties
          title: `${task.title} - Duplicate`,
        });

        await Notice.create({
          team: task.team,
          text: `New task "${newTask.title}" has been assigned to you.`,
          task: newTask._id,
        });

        res.status(200).json({ status: true, message: "Task duplicated successfully." });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    };

    export const postTaskActivity = async (req, res) => {
      try {
        const { id } = req.params;
        const { userId } = req.user;
        const { type, activity } = req.body;

        const task = await Task.findById(id);
        if (!task) {
          return res.status(404).json({ status: false, message: "Task not found." });
        }

        const data = { type, activity, by: userId };
        task.activities.push(data);

        await task.save();

        res.status(200).json({ status: true, message: "Activity posted successfully." });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    };

    export const dashboardStatistics = async (req, res) => {
      try {
        const allTasks = await Task.find({ isTrashed: false })
          .populate({ path: "team", select: "name role title email" })
          .sort({ _id: -1 });

        const users = await User.find({ isActive: true })
          .select("name title role createdAt")
          .limit(10)
          .sort({ _id: -1 });

        const groupTasksByStage = allTasks.reduce((result, task) => {
          result[task.stage] = (result[task.stage] || 0) + 1;
          return result;
        }, {});

        const groupData = Object.entries(allTasks.reduce((result, task) => {
          result[task.priority] = (result[task.priority] || 0) + 1;
          return result;
        }, {})).map(([name, total]) => ({ name, total }));

        const summary = {
          totalTasks: allTasks.length,
          last10Tasks: allTasks.slice(0, 10),
          users,
          tasks: groupTasksByStage,
          graphData: groupData,
        };

        res.status(200).json({ status: true, message: "Statistics fetched successfully", ...summary });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    };

    export const getTasks = async (req, res) => {
      try {
        const { stage, isTrashed } = req.query;

        const query = { isTrashed: isTrashed ? true : false };
        if (stage) {
          query.stage = stage.toLowerCase();
        }

        const tasks = await Task.find(query)
          .populate({ path: "team", select: "name title email" })
          .sort({ _id: -1 });

        res.status(200).json({ status: true, tasks });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    };

    export const getTask = async (req, res) => {
      try {
        const { id } = req.params;

        const task = await Task.findById(id)
          .populate({ path: "team", select: "name title role email" })
          .populate({ path: "activities.by", select: "name" });

        if (!task) {
          return res.status(404).json({ status: false, message: "Task not found." });
        }

        res.status(200).json({ status: true, task });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    };

    export const createSubTask = async (req, res) => {
      try {
        const { title, tag, date } = req.body;
        const { id } = req.params;

        const task = await Task.findById(id);
        if (!task) {
          return res.status(404).json({ status: false, message: "Task not found." });
        }

        const newSubTask = { title, date, tag };
        task.subTasks.push(newSubTask);

        await task.save();

        res.status(200).json({ status: true, message: "SubTask added successfully." });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    };

    export const updateTask = async (req, res) => {
      try {
        const { id } = req.params;
        const { title, date, team, stage, priority, assets } = req.body;

        const task = await Task.findById(id);
        if (!task) {
          return res.status(404).json({ status: false, message: "Task not found." });
        }

        task.title = title;
        task.date = date;
        task.priority = priority.toLowerCase();
        task.assets = assets;
        task.stage = stage.toLowerCase();
        task.team = team;

        await task.save();

        res.status(200).json({ status: true, message: "Task updated successfully." });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    };

    export const trashTask = async (req, res) => {
      try {
        const { id } = req.params;
        
        const task = await Task.findById(id);
        if (!task) {
          return res.status(404).json({
            status: false,
            message: "Task not found"
          });
        }

        task.isTrashed = true;
        await task.save();

        // Create notifications for team members about task deletion
        await Promise.all(
          task.team.map(async (memberId) => {
            return await Notice.create({
              team: [memberId],
              text: `Task "${task.title}" has been moved to trash`,
              task: task._id,
              notiType: "alert",
              isRead: []
            });
          })
        );

        res.status(200).json({
          status: true,
          message: "Task moved to trash successfully"
        });
      } catch (error) {
        console.error("Error trashing task:", error);
        res.status(500).json({
          status: false,
          message: error.message || "Failed to move task to trash"
        });
      }
    };

    export const getTrashTasks = async (req, res) => {
      try {
        // Get all trashed tasks
        const trashedTasks = await Task.find({ isTrashed: true })
          .populate({ path: "team", select: "name title email" })
          .sort({ updatedAt: -1 });

        res.status(200).json({
          status: true,
          tasks: trashedTasks
        });
      } catch (error) {
        console.error(error);
        res.status(400).json({
          status: false,
          message: error.message
        });
      }
    };

    export const deleteRestoreTask = async (req, res) => {
      try {
        const { id } = req.params;
        const { actionType } = req.query;

        switch (actionType) {
          case "delete":
            await Task.findByIdAndDelete(id);
            break;
          case "deleteAll":
            await Task.deleteMany({ isTrashed: true });
            break;
          case "restore":
            const taskToRestore = await Task.findById(id);
            if (taskToRestore) {
              taskToRestore.isTrashed = false;
              await taskToRestore.save();
            } else {
              return res.status(404).json({ status: false, message: "Task not found." });
            }
            break;
          case "restoreAll":
            await Task.updateMany({ isTrashed: true }, { $set: { isTrashed: false } });
            break;
          default:
            return res.status(400).json({ status: false, message: "Invalid action type." });
        }

        res.status(200).json({ status: true, message: "Operation performed successfully." });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    };

    export const TaskData = async (req, res) => {
      try {
        const data = await Task.find().populate({ path: "team", select: "name title email" });
        res.status(200).json({ status: true, message: "Data fetched successfully", data });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    };

    export const getTotalTasks = async (req, res) => {
      try {
        const data = await Task.find({ isTrashed: false })
          .populate({ path: "team", select: "name title email" })
          .sort({ _id: -1 });

        res.status(200).json({ status: true, message: "Data fetched successfully", data });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error.message });
      }
    };

    export const deleteTask = async (req, res) => {
      try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        
        if (!task) {
          return res.status(404).json({
            status: false,
            message: "Task not found"
          });
        }

        res.status(200).json({
          status: true,
          message: "Task deleted successfully"
        });
      } catch (error) {
        console.error(error);
        res.status(400).json({
          status: false,
          message: error.message
        });
      }
    };

    
