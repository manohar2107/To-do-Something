import React, { useState,useContext } from 'react';
import {TodoContext} from "../context/TodoContext";

function ListItem({ list, onToggle, onStartEdit, onDelete }) {
  return (
    <li style={{ marginBottom: "10px", listStyle: "none" }} className="todo-card">
      <div className="todo-card-body">
        <span style={{ textDecoration: list.done ? "line-through" : "none" }} className="task-text">
          {list.task}
        </span>
        <div className="actions">
          <input 
            type="checkbox" 
            checked={list.done} 
            onChange={() => onToggle(list.id)} 
          />
          <button onClick={() => onStartEdit(list)} className="edit-btn">✏️</button>
          <button onClick={() => onDelete(list.id)} className="delete-btn">🗑️</button>
        </div>
      </div>
    </li>
  );
}

export default function List({selectedTasks }) {
    const {tasks, dispatch} = useContext(TodoContext);
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");

  const startEdit = (task) => {
    setEditingTask(task);
    setEditText(task.task);
  };

  const saveChanges = () => {
    dispatch({ type: "EDIT_TASK", payload: { id: editingTask.id, newTask: editText } });
    setEditingTask(null);
  };

  // Filter tasks inline using cleaner logic
  const filteredTasks = tasks.filter(t => {
    if (selectedTasks === "Done") return t.done;
    if (selectedTasks === "ToDo") return !t.done;
    return true; // "All"
  });

  if (filteredTasks.length === 0) {
    return <p className="empty-message">No tasks found here!</p>;
  }

  return (
    <>
      {filteredTasks.map(list => (
        <ListItem 
          key={list.id} 
          list={list} 
          onToggle={(id) => dispatch({ type: "TOGGLE_TASK", payload:id })}
          onStartEdit={startEdit} 
          onDelete={(id) => dispatch({ type: "DELETE_TASK", payload:id })} 
        />
      ))}

      {/* Modern custom lightweight inline modal */}
      {editingTask && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3>Edit Task</h3>
            <input 
              type="text" 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)} 
            />
            <div className="modal-buttons">
              <button onClick={saveChanges} className="primary-btn">Save Changes</button>
              <button onClick={() => setEditingTask(null)} className="secondary-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}