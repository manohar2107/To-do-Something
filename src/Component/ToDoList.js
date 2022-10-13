import { faDeleteLeft, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component } from "react";
import { Button, Card } from "react-bootstrap";

class List extends Component{
    constructor(props){
        super(props);
        this.handleChange=this.handleChange.bind(this);
    }

    handleChange(e){
        this.props.onHandleChange(e.target.name);
        // e.preventDefault();
    }
    render(){
        if(this.props.selectedTasks==="All"){
            return this.props.tasks.map(list=>
                    <li key={list.id} style={{marginBottom:"10px",listStyle:"none"}}>
                        <Card>
                            <Card.Body>
                                <span style={{position:"absolute",left:"20px",top:"2px"}}>{list.task}</span>
                                <span style={{position:"absolute",right:"50px",top:"2px"}}><input name={list.id} type="checkbox" checked={list.done} onChange={this.handleChange} style={{marginRight:"5px"}} /><button style={{border:"none",background:"white"}}><FontAwesomeIcon style={{marginRight:"5px"}} icon={faPen}/></button><button style={{border:"none",background:"white"}}><FontAwesomeIcon style={{marginRight:"5px"}} icon={faDeleteLeft} /></button></span>
                            </Card.Body>
                        </Card>
                    </li>
            );
        }
        else if(this.props.selectedTasks==="Done"){
            return this.props.tasks.map(list=>{
                if(list.done===true){
                    return <li key={list.id} style={{marginBottom:"10px",listStyle:"none"}}>
                                <Card>
                                    <Card.Body>
                                        <span style={{position:"absolute",left:"20px",top:"2px"}}>{list.task}</span>
                                        <span style={{position:"absolute",right:"50px",top:"2px"}}><input type="checkbox" checked={list.done} onChange={this.handleChange} style={{marginRight:"5px"}} /><button style={{border:"none",background:"white"}}><FontAwesomeIcon style={{marginRight:"5px"}} icon={faPen}/></button><button style={{border:"none",background:"white"}}><FontAwesomeIcon style={{marginRight:"5px"}} icon={faDeleteLeft} /></button></span>
                                    </Card.Body>
                                </Card>
                            </li>
                }
            });
        }return this.props.tasks.map(list=>{
            if(list.done!==true){
                return <li key={list.id} style={{marginBottom:"10px",listStyle:"none"}}>
                            <Card>
                                <Card.Body>
                                    <span style={{position:"absolute",left:"20px",top:"2px"}}>{list.task}</span>
                                    <span style={{position:"absolute",right:"50px",top:"2px"}}><input type="checkbox" checked={list.done} onChange={this.handleChange} style={{marginRight:"5px"}} /><button style={{border:"none",background:"white"}}><FontAwesomeIcon style={{marginRight:"5px"}} icon={faPen}/></button><button style={{border:"none",background:"white"}}><FontAwesomeIcon style={{marginRight:"5px"}} icon={faDeleteLeft} /></button></span>
                                </Card.Body>
                            </Card>
                        </li>
            }
        });

    }
}

class ToDoList extends Component{
    constructor(props){
        super(props);
        this.state={
            selectedTasks:"All"
        }
        this.handleTasks=this.handleTasks.bind(this);
        this.handleCheck=this.handleCheck.bind(this);
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

                <ul style={{width:"70%",padding:"30px",marginLeft:"15%"}}><List tasks={this.props.tasks} selectedTasks={this.state.selectedTasks} onHandleChange={this.handleCheck}/></ul>

                {/* Buttons to delete tasks */}
                <div className="container" style={{alignItems:"center",margin:"auto",width:"60%",padding:"30px"}}>
                    <div className="row">
                        <Button className="col-xs-5 col-5" style={{margin:"auto"}} variant="danger" >Delete All Tasks</Button>
                        <Button className="col-xs-5 col-5" style={{margin:"auto"}} variant="danger" >Delete Done Task</Button>
                    </div>
                </div>
            </article>
        );
    }

};

export default ToDoList;