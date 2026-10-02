import React, { useState,useContext } from 'react';
import List from './Lists';
import { TodoContext } from '../context/TodoContext';
import { useDocument } from '../context/DocumentContext';
import '../App.css';

export default function ToDoList() {
  const {canEdit}=useDocument();
  const [selectedTasks, setSelectedTasks] = useState("ToDo"); // Default filter is "ToDo"
  const {massDelete,tasks} = useContext(TodoContext);

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const allCount = safeTasks.length;
  const doneCount = safeTasks.filter((t) => t.done).length;
  const todoCount = safeTasks.filter((t) => !t.done).length;

  return (
    <article>
      <h2 className="list-header" style={{ textAlign: 'center' }} >Your Tasks</h2>

      {/* Filter Buttons */}
      <div className="filter-btn-group">
        {/* <button className={selectedTasks === "All" ? "active filter-btn" : "filter-btn"} onClick={() => setSelectedTasks("All")}>
          All<span className="filter-count-badge">{allCount}</span>
          </button> */}
        <button className={selectedTasks === "ToDo" ? "active filter-btn" : "filter-btn"} onClick={() => setSelectedTasks("ToDo")}>
          ToDo {selectedTasks === "ToDo" && <span className="filter-count-badge"> {todoCount} </span>}
        </button>
        <button className={selectedTasks === "Done" ? "active filter-btn" : "filter-btn"} onClick={() => setSelectedTasks("Done")}>
          Done{selectedTasks === "Done" && <span className="filter-count-badge">{doneCount}</span>} 
        </button>
      </div>

      <ul className="todo-list-wrapper">
        <List selectedTasks={selectedTasks} canEdit={canEdit}/>
      </ul>

      {/* Mass Delete Buttons */}
      {canEdit && (
  <div className="bulk-actions-container">
    <button
      type="button"
      onClick={() => {
        if (window.confirm("Are you sure you want to delete ALL tasks in this workspace?")) {
          massDelete('All');
        }
      }}
      className="bulk-btn delete-all-btn"
    >
      🗑️ Delete All Tasks
    </button>

    <button
      type="button"
      onClick={() => massDelete('Done')}
      className="bulk-btn delete-done-btn"
    >
      ✓ Clear Done Tasks
    </button>
  </div>
)}
    </article>
  );
}