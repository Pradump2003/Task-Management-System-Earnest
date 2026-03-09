const expressAsyncHandler = require("express-async-handler");
const taskCollection = require("../models/task.models");

const allTasks = expressAsyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const tasks = await taskCollection.find({ userId });
  if (!tasks) {
    return res.status(404).json({
      success: false,
      message: "No tasks found",
    });
  }

  res.status(200).json({
    success: true,
    message: "tasks retrieved successfully",
    data: tasks,
  });
});

const createTask = expressAsyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user?._id;
  const newTask = await taskCollection.create({
    title,
    description,
    userId,
  });
  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: newTask,
  });
});

const updateTask = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const userId = req.user?._id;
  const task = await taskCollection.findOne({ _id: id, userId });
  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }
  const updatedTask = await taskCollection.findByIdAndUpdate(
    id,
    { title, description, completed },
    { new: true },
  );
  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask,
  });
});

const deleteTask = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const task = await taskCollection.findOne({ _id: id, userId });
  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }
  await taskCollection.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

module.exports = {
  allTasks,
  createTask,
  updateTask,
  deleteTask,
};
