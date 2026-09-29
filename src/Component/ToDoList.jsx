import React, { useState,useContext } from 'react';
import List from './Lists';
import { TodoContext } from '../context/TodoContext';
import { useDocument } from '../context/DocumentContext';
import '../App.css';

export default function ToDoList() {
  const {canEdit}=useDocument();
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
        <List selectedTasks={selectedTasks} canEdit={canEdit}/>
      </ul>

      {/* Mass Delete Buttons */}
      {/* {canEdit && (
        <div className="bulk-actions-container">
          <button onClick={handleDeleteAll} className="bulk-btn">Delete All Tasks</button>
          <button onClick={handleDeleteDone} className="bulk-btn">Delete Done Tasks</button>
        </div>
      )} */}
    </article>
  );
}