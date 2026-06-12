import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ToDO from './ToDo';
import { TodoProvider } from './context/TodoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TodoProvider>
      <ToDO />
    </TodoProvider>
  </React.StrictMode>
);

