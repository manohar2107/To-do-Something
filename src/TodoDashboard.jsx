import React from 'react';
import './App.css';
import ToDoInput from './Component/ToDoInput';
import ToDoList from './Component/ToDoList';

export default function TodoDashboard() {
  return (
    <div className="dashboard-container">
      <aside className="dashboard-left-panel">
        <ToDoInput />
      </aside>

      <main className="dashboard-right-panel">
        <ToDoList />
      </main>
    </div>
  );
}