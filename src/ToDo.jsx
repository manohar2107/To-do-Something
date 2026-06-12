import React from 'react';
import './App.css';
import ToDoInput from './Component/ToDoInput';
import ToDoList from './Component/ToDoList';

export default function ToDO() {
  return (
    <div className='App'>
      <ToDoInput />
      <ToDoList />
    </div>
  );
}