import React, { createContext,useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {useDocument} from './DocumentContext';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  // We use a clean state array to hold our server's current tasks list
  const [tasks, setTasks] = useState([]);
  const {activeDoc}=useDocument();
  const [loading,setLoading]=useState(false);
  const {token} = useAuth(); // Get the auth token from context

  // Fetch (Initial Load)
  useEffect(() => {
    if (!token || !activeDoc?._id) {
      console.warn("No auth token found. Skipping task fetch.");
      setTasks([]);
      return;
    }

    setTasks([]);

    const fetchTasks = async () => {
      setLoading(true);
      console.log('useEffect: Fetching tasks from server...');
      try {
       const response = await fetch(`/api/tasks/doc/${activeDoc._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
          if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || errorData.error || "Failed to fetch tasks");
          }
        const data = await response.json();
      if (response.ok) {
          setTasks(data);
        } else {
          console.error('Server error fetching tasks:', data.error);
          setTasks([]); // Ensure list stays clean on failure
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [token,activeDoc?._id]);

 // Create Task for the active document
  const addTask = async (taskText) => {
    if (!activeDoc?._id) return;
    try {
      const res = await fetch(`/api/tasks/doc/${activeDoc._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task: taskText }),
      });
      const data = await res.json();
      if (res.ok) setTasks((prev) => [data, ...prev]);
    } catch (err) {
      console.error('Add task failed:', err);
    }
  };

  // Toggle Task Status
  const toggleTask = async (taskId, currentStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ done: !currentStatus }),
      });
      const updated = await res.json();
      if (res.ok) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  // Edit Task Text
  const editTaskText = async (taskId, newText) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task: newText }),
      });
      const updated = await res.json();
      if (res.ok) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  // delete (Remove Single Task)
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

  //  MASS CLEAR OUT
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
      loading, 
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

export const useTodo=()=>useContext(TodoContext);