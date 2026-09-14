import React , { useState ,useContext } from "react";
import { TodoContext } from "../context/TodoContext";
import '../App.css';

export default function ToDoInput(){
    const [task, setTask] = useState("");
    const {addTask} = useContext(TodoContext);

    function handleAddTask(evt){
        evt.preventDefault();
        if(!task.trim()){
            alert("Empty task like your life. Please make some choices!");
            return;
        }
        addTask(task.trim());
        setTask("");
    };
    
    return(
        <div className="input-card">
            <textarea
                className="task-textarea"
                rows={3}
                placeholder="What needs to be accomplished today?"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddTask(e);
                }
                }}
            />
            <div className="button-row-center">
                <button className="primary-btn" onClick={handleAddTask}>
                    Add Task
                </button>
            </div>
            
        </div>
    );
}