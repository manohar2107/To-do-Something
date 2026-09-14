import React, { useState,useContext } from 'react';
import List from './Lists';
import { TodoContext } from '../context/TodoContext';

export default function ToDoList() {
  const [selectedTasks, setSelectedTasks] = useState("All");
  const {massDelete} = useContext(TodoContext);

  return (
    <article>
      <h2 className="list-header" style={{ textAlign: 'center' }} >Your Tasks</h2>

      {/* Filter Buttons */}
      <div className="filter-btn-group">
        <button className={selectedTasks === "All" ? "active filter-btn" : "filter-btn"} onClick={() => setSelectedTasks("All")}>All</button>
        <button className={selectedTasks === "Done" ? "active filter-btn" : "filter-btn"} onClick={() => setSelectedTasks("Done")}>Done</button>
        <button className={selectedTasks === "ToDo" ? "active filter-btn" : "filter-btn"} onClick={() => setSelectedTasks("ToDo")}>ToDo</button>
      </div>

      <ul className="todo-list-wrapper">
        <List selectedTasks={selectedTasks}/>
      </ul>

      {/* Mass Delete Buttons */}
      <div className="delete-btn-group">
        <button className="danger-btn" onClick={() => massDelete("All")}>Delete All Tasks</button>
        <button className="danger-btn" onClick={() => massDelete("Done")}>Delete Done Tasks</button>
      </div>
    </article>
  );
}