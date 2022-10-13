import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component } from "react";
import { Button } from "react-bootstrap";


class ToDoInput extends Component{
    constructor(props){
        super(props);
        this.state={
            todo:""
        };
        this.handleAddTask=this.handleAddTask.bind(this);
        this.handleInput=this.handleInput.bind(this);
    }

    handleAddTask(){
        this.props.onAddingTask(this.state.todo);
        this.setState(
            {todo:""}
        );

    }

    handleInput(e){

        this.setState(
            {todo:e.target.value}
        );
    }
    
    render(){
        return(
            <article style={{padding:"20px"}}>
                <h2>To-Do Input</h2>
                <div className="container" style={{border:"1px solid lightcyan",alignItems:"center",width:"70%",margin:"auto",padding:"20px"}}>
                    <div className="row" style={{marginBottom:"10px"}}>
                        <div className="col-xs-12 col-12">
                            <span  style={{backgroundColor:"cyan",padding:"5px"}}><FontAwesomeIcon icon={faBook} size="lg"/></span>
                            <input name="todo" value={this.state.todo} onChange={this.handleInput} placeholder="New todo" className="col-xs-11 col-11"></input></div>
                        </div>
                        <Button type="submit" className="col-xs-12 col-12" onClick={this.handleAddTask}>New Task</Button>
                </div>
            </article>
        );
    }
}

export default ToDoInput;