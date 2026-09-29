// src/Component/Lists.jsx
import React, { useState, useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { useDocument } from '../context/DocumentContext'; // 👈 Import Document Context
import '../App.css';

function ListItem({ list, onToggle, onSaveEdit, onDelete, canEdit }) {
  const taskId = list.id || list._id;
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(list.task);

  const handleSave = () => {
    if (!editedText.trim()) return;
    onSaveEdit(taskId, editedText.trim());
    setIsEditing(false);
  };

  return (
    <li style={{ marginBottom: "10px", listStyle: "none" }} className="todo-card">
      <div className="todo-card-body">
        {isEditing && canEdit ? (
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
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <span
              style={{ textDecoration: list.done ? "line-through" : "none" }}
              className="task-text"
            >
              {list.task}
            </span>

            <div className="actions">
              {/* Checkbox: disabled if viewer */}
              <input
                type="checkbox"
                checked={list.done}
                disabled={!canEdit}
                onChange={() => canEdit && onToggle(taskId, list.done)}
                style={{ cursor: canEdit ? 'pointer' : 'not-allowed' }}
              />

              {/* Action buttons: Only visible if Editor or Owner */}
              {canEdit && (
                <>
                  <button onClick={() => setIsEditing(true)} className="edit-btn" title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => onDelete(taskId)} className="delete-btn" title="Delete">
                    🗑️
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </li>
  );
}

export default function List({ selectedTasks, canEdit:propEdit}) {
  const { tasks, toggleTask, editTaskText, deleteTask } = useContext(TodoContext);
  const docCtx = useDocument(); // 👈 Access role state

  const canEdit=propEdit!==undefined?propEdit:docCtx?.canEdit;

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const filteredTasks = safeTasks.filter((t) => {
    if (selectedTasks === "Done") return t.done;
    if (selectedTasks === "ToDo") return !t.done;
    return true;
  });

  if (filteredTasks.length === 0) {
    return <p className="empty-message">No tasks found here!</p>;
  }

  return (
    <>
    <ul style={{ padding: 0, margin: 0 }}>
      {filteredTasks.map((list) => (
        <ListItem
          key={list.id || list._id}
          list={list}
          canEdit={canEdit}
          onToggle={toggleTask}
          onSaveEdit={editTaskText}
          onDelete={deleteTask}
        />
      ))}
    </ul>
    </>
  );
}