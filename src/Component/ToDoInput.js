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

    handleAddTask(evt){
        evt.preventDefault();
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
                <form onSubmit={this.handleAddTask} className="container" style={{border:"1px solid lightcyan",alignItems:"center",width:"70%",margin:"auto",padding:"20px"}}>
                    <div className="row" style={{marginBottom:"10px"}}>
                        <div className="col-xs-12 col-12">
                            <span  style={{backgroundColor:"cyan",padding:"5px"}} className="fa fa-book"></span>
                            <input type="text" name="todo" value={this.state.todo} onChange={this.handleInput} placeholder="New todo" className="col-xs-11 col-11"></input></div>
                        </div>
                        <Button type="submit" className="col-xs-12 col-12">New Task</Button>
                </form>
            </article>
        );
    }
}

export default ToDoInput;