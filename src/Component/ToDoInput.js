import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component } from "react";
import { Button } from "react-bootstrap";


class ToDoInput extends Component{
    render(){
        return(
            <article style={{padding:"20px"}}>
                <h1>To-Do Input</h1>
                <div className="container" style={{border:"1px solid lightcyan",alignItems:"center",width:"60%",margin:"auto",padding:"20px"}}>
                    <div className="row" style={{marginBottom:"10px"}}>
                        <div className="col-12">
                            <span  style={{backgroundColor:"cyan",padding:"5px"}}><FontAwesomeIcon icon={faBook} size="lg"/></span>
                            <input name="todo" placeholder="New todo" className="col-11"></input></div>
                        </div>
                        <Button type="submit" className="col-12">New Task</Button>
                </div>
            </article>
        );
    }
}

export default ToDoInput;