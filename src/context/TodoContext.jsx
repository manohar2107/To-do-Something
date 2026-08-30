import React, { createContext, useState, useEffect } from 'react';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  // We use a clean state array to hold our server's current tasks list
  const [tasks, setTasks] = useState([]);

  // 1. READ (Initial Load)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        setTasks(data); // Instantly hydrates the screen on boot
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  // 2. CREATE (Add Task)
  const addTask = async (text) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: text })
      });
      const newServerTask = await response.json();
      
      // 🌟 FIX: Append the new task and force a brand new array reference instantly
      setTasks((prevTasks) => [...prevTasks, newServerTask]);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // 3. UPDATE (Toggle Complete Status)
  const toggleTask = async (id, currentDoneStatus) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !currentDoneStatus })
      });
      const updatedTask = await response.json();
      
      // 🌟 FIX: Swap the targeted item inline, creating a reactive layout refresh
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? updatedTask : t))
      );
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  // 4. UPDATE (Edit Text Content)
  const editTaskText = async (id, newText) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newText })
      });
      const updatedTask = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? updatedTask : t))
      );
    } catch (err) {
      console.error("Error updating text:", err);
    }
  };

  // 5. DELETE (Remove Single Task)
  const deleteTask = async (id) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      
      // 🌟 FIX: Filter out the deleted ID, forcing an instant row pop
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // 6. MASS CLEAR OUT
  const massDelete = async (type) => {
    try {
      const response = await fetch('/api/tasks/mass-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      const adjustedTasksList = await response.json();
      setTasks(adjustedTasksList); // Overwrite with server's trimmed array
    } catch (err) {
      console.error("Error mass clearing:", err);
    }
  };

  return (
    <TodoContext.Provider value={{ 
      tasks, 
      addTask, 
      toggleTask, 
      editTaskText, 
      deleteTask, 
      massDelete 
    }}>
      {children}
    </TodoContext.Provider>
  );
};