import React, { useState,useContext } from 'react';
import {TodoContext} from "../context/TodoContext";
import '../App.css';

function ListItem({ list, onToggle, onSaveEdit, onDelete }) {
  const taskId=list.id || list._id; // Fallback for mongoDB's _id if id is not present
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(list.task);

  const handleSave = () => {
    if(!editedText.trim()){
      alert("Task cannot be empty. Please enter a valid task.");
      return;
    }
    onSaveEdit(taskId, editedText.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(list.task);
    setIsEditing(false);
  }

  const editInput= ()=>{
    return (
      <div className="edit-box-container">
            <textarea
              className="task-edit-textarea"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={2}
              autoFocus
            />
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
    );
  }

  const normalView=()=>{
    return (
      <>
            <span 
              style={{ textDecoration: list.done ? "line-through" : "none" }} 
              className="task-text"
            >
              {list.task}
            </span>
            <div className="actions">
              <input 
                type="checkbox" 
                checked={list.done} 
                onChange={() => onToggle(taskId, list.done)} 
              />
              <button onClick={() => setIsEditing(true)} className="edit-btn">✏️</button>
              <button onClick={() => taskId && onDelete(taskId)} className="delete-btn">🗑️</button>
            </div>
          </>
    );
  }

  return (
    <li style={{ marginBottom: "10px", listStyle: "none" }} className="todo-card">
      <div className="todo-card-body">
        {isEditing ? editInput() : normalView()}
      </div>
    </li>
  );
}

export default function List({selectedTasks }) {
  const {tasks, toggleTask, editTaskText, deleteTask} = useContext(TodoContext);

  // Filter tasks inline using cleaner logic
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const filteredTasks = safeTasks.filter(t => {
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
          key={list.id || list._id} 
          list={list} 
          onToggle={toggleTask}
          onSaveEdit={editTaskText} 
          onDelete={deleteTask} 
        />
      ))}
    </>
  );
}