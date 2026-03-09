import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:9000/v1/tasks", { headers });
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await axios.post("http://localhost:9000/v1/tasks", newTask, { headers });
      if (res.data.success) {
        setTasks([...tasks, res.data.data]);
        setNewTask({ title: "", description: "" });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleCompleted = async (id, currentCompleted) => {
    try {
      const res = await axios.patch(`http://localhost:9000/v1/tasks/${id}`, { completed: !currentCompleted }, { headers });
      if (res.data.success) {
        setTasks(tasks.map(task => task._id === id ? res.data.data : task));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/v1/tasks/${id}`, { headers });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Create New Task</h2>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          required
        />
        <button type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Task"}
        </button>
      </form>

      <h2>Your Tasks</h2>
      <div>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Completed: {task.completed ? "Yes" : "No"}</p>
                <button onClick={() => handleToggleCompleted(task._id, task.completed)}>
                  Mark as {task.completed ? "Incomplete" : "Completed"}
                </button>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;