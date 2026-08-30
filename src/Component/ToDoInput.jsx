import React , { useState ,useContext } from "react";
import { TodoContext } from "../context/TodoContext";

export default function ToDoInput(){
    const [task, setTask] = useState("");
    const {addTask} = useContext(TodoContext);

    function handleAddTask(evt){
        evt.preventDefault();
        if(!task.trim()){
            alert("Empty task like your life. Please make some choices!");
            return;
        }
        addTask(task);
        setTask("");
    };
    
    return(
        <article style={{padding:"20px"}}>
            <h2 style={{textAlign:"center"}}>To-Do Input</h2>
            <form onSubmit={handleAddTask} className="todo_form">
                <div className="input-group">
                    <input type="text" name="task" className="input-control" placeholder="Enter your task here..." value={task} onChange={(evt) => setTask(evt.target.value)} />
                </div>
                <button type="submit" className="add-btn">New Task</button>
            </form>
        </article>
    );
}