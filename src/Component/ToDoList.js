import { Component } from "react";
import { Button } from "react-bootstrap"; 
import List from "./Lists";

class ToDoList extends Component{
    constructor(props){
        super(props);
        this.state={
            selectedTasks:"All"
        }
        this.handleTasks=this.handleTasks.bind(this);
        this.handleCheck=this.handleCheck.bind(this);
        this.handleSavedChange=this.handleSavedChange.bind(this);
        this.handleDeleteItem=this.handleDeleteItem.bind(this);
        this.handleDelete=this.handleDelete.bind(this);
    }

    handleTasks(e){
        // console.log(e.target.innerHTML);
        this.setState({
            selectedTasks:e.target.innerHTML
        });
    }

    handleCheck(val){
        this.props.onChangingCheck(val);
    }

    handleSavedChange(val){
        this.props.onChangingTask(val);
    }

    handleDeleteItem(val){
        this.props.onHandleDeleteListItem(val);
    }

    handleDelete(e){
        // console.log(e.target.name);
        this.props.onHandleDeleteTasks(e.target.name);
    }

    render(){

        return(
            <article>
                <h2>ToDo List</h2>

                {/* BUttons to select tasks */}
                <div className="container" style={{alignItems:"center",margin:"auto",width:"70%",padding:"30px"}}>
                    <div className="row">
                        <Button className="col-xs-3 col-3" style={{margin:"auto"}} onClick={this.handleTasks}>All</Button>
                        <Button className="col-xs-3 col-3" style={{margin:"auto"}} onClick={this.handleTasks}>Done</Button>
                        <Button className="col-xs-3 col-3" style={{margin:"auto"}} onClick={this.handleTasks}>ToDo</Button>
                    </div>
                </div>

                <ul style={{width:"70%",padding:"30px",marginLeft:"15%"}}><List tasks={this.props.tasks}
                 selectedTasks={this.state.selectedTasks}
                  onHandleChange={this.handleCheck}
                  onSavingChanges={this.handleSavedChange}
                  onHandleDeleteItem={this.handleDeleteItem} /></ul>

                {/* Buttons to delete tasks */}
                <div className="container" style={{alignItems:"center",margin:"auto",width:"60%",padding:"30px"}}>
                    <div className="row">
                        <Button name="All" className="col-xs-5 col-5" style={{margin:"auto"}} variant="danger"  onClick={this.handleDelete}>Delete All Tasks</Button>
                        <Button name="Done" className="col-xs-5 col-5" style={{margin:"auto"}} variant="danger" onClick={this.handleDelete}>Delete Done Task</Button>
                    </div>
                </div>
            </article>
        );
    }

};

export default ToDoList;