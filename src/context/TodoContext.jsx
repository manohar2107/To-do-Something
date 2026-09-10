import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  // We use a clean state array to hold our server's current tasks list
  const [tasks, setTasks] = useState([]);
  const {token} = useAuth(); // Get the auth token from context

  // 1. READ (Initial Load)
  useEffect(() => {
    if (!token) {
      console.warn("No auth token found. Skipping task fetch.");
      return;
    }

    const fetchTasks = async () => {
      console.log('useEffect: Fetching tasks from server...');
      try {
        const response = await fetch('/api/tasks',{
          headers: { 'Authorization': `Bearer ${token}` ,
            'Content-Type': 'application/json' },
          });
          if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || errorData.error || "Failed to fetch tasks");
          }
        const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
      }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [token]);

  // 2. CREATE (Add Task)
  const addTask = async (taskText) => {
  if (!token || !taskText.trim()) return;

  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ task: taskText.trim() }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Add task failed:', errorData.error);
      return;
    }

    const newTask = await res.json();

    // 🛡️ Ensure prev is an array before spreading
    setTasks((prevTasks) => {
      if (Array.isArray(prevTasks)) {
        return [...prevTasks, newTask];
      }
      return [newTask];
    });
  } catch (err) {
    console.error('Error adding task:', err);
  }
};

  // 3. UPDATE (Toggle Complete Status)
  const toggleTask = async (id, currentDoneStatus) => {
    if(!token) { 
      console.warn("Who are ya!!!!(No Auth key)");
      return;
    }
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ done: !currentDoneStatus })
      });
      const updatedTask = await response.json();
      
      // 🌟 FIX: Swap the targeted item inline, creating a reactive layout refresh
      setTasks((prevTasks) =>
        prevTasks.map((t) => ((t.id || t._id) === id ? updatedTask : t))
      );
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  // 4. UPDATE (Edit Text Content)
  const editTaskText = async (id, newText) => {
    if(!token) { 
      console.warn("Who are ya!!!!(No Auth key)");
      return;
    }
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ task: newText })
      });
      const updatedTask = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((t) => ((t.id || t._id) === id ? updatedTask : t))
      );
    } catch (err) {
      console.error("Error updating text:", err);
    }
  };

  // 5. DELETE (Remove Single Task)
  const deleteTask = async (id) => {
    if(!token) { 
      console.warn("Who are ya!!!!(No Auth key)");
      return;
    }
    try {
      const response = await fetch(`/api/tasks/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      // 🌟 FIX: Filter out the deleted ID, forcing an instant row pop
      setTasks((prevTasks) => prevTasks.filter((t) => (t.id || t._id) !== id));
      console.log(result.message);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // 6. MASS CLEAR OUT
 const massDelete = async (type) => {
  if (!token) {
    console.warn('Who are ya!!!! (No Auth key)');
    return;
  }

  try {
    const response = await fetch('/api/tasks/mass-delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type: type.toLowerCase() }), // normalize to lowercase
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Delete failed:', err.error);
      return;
    }

    // 🛡️ Do NOT set tasks to response.json()! Filter the local array instead:
    const mode = type.toLowerCase();
    if (mode === 'done') {
      setTasks((prevTasks) =>
        Array.isArray(prevTasks) ? prevTasks.filter((task) => !task.done) : []
      );
    } else if (mode === 'all') {
      setTasks([]);
    }
  } catch (err) {
    console.error('Error in massDelete:', err);
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