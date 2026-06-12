import React, { useState,useContext } from 'react';
import List from './Lists';
import { TodoContext } from '../context/TodoContext';

export default function ToDoList() {
  const [selectedTasks, setSelectedTasks] = useState("All");
  const {dispatch} = useContext(TodoContext);

  return (
    <article>
      <h2>ToDo List</h2>

      {/* Filter Buttons */}
      <div className="filter-container">
        <button className={selectedTasks === "All" ? "active" : ""} onClick={() => setSelectedTasks("All")}>All</button>
        <button className={selectedTasks === "Done" ? "active" : ""} onClick={() => setSelectedTasks("Done")}>Done</button>
        <button className={selectedTasks === "ToDo" ? "active" : ""} onClick={() => setSelectedTasks("ToDo")}>ToDo</button>
      </div>

      <ul className="todo-list-wrapper">
        <List selectedTasks={selectedTasks}/>
      </ul>

      {/* Mass Delete Buttons */}
      <div className="delete-container">
        <button className="danger-btn" onClick={() => {dispatch({type:"MASS_DELETE", payload: "All"})}}>Delete All Tasks</button>
        <button className="danger-btn" onClick={() => {dispatch({type:"MASS_DELETE", payload: "Done"})}}>Delete Done Tasks</button>
      </div>
    </article>
  );
}