import { Component } from "react";
import { Button, Card, Modal,ModalBody ,ModalFooter, ModalHeader, ModalTitle, OverlayTrigger, Tooltip } from "react-bootstrap";

class List extends Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            idx:1
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleModal=this.handleModal.bind(this);
        this.handleClose=this.handleClose.bind(this);
        this.handleEditTask=this.handleEditTask.bind(this);
        this.handleSaveChanges=this.handleSaveChanges.bind(this);
    }

    handleChange(e){
        this.props.onHandleChange(e.target.name);
        // e.preventDefault();
    }
    
    handleModal(e){
        this.setState({
            idx:parseInt(e.target.name)
        },()=>this.setState({
            show:true
        }));
    }

    handleClose(){
        // console.log(this.props.tasks[this.state.idx-1]);
        this.setState({
            show:false,
        });
    }

    handleEditTask(e){
        this.props.tasks[this.state.idx-1].task=e.target.value;
    }

    handleSaveChanges(){
        this.props.onSavingChanges(this.props.tasks);
        this.handleClose();
    }

    render(){
        let countAll=0,countDone=0,countTodo=0;
        this.props.tasks.forEach(element => {
            countAll++;
            if(element.done) countDone++;
            else countTodo++;
        });
        // Display All Task
        if(this.props.selectedTasks==="All"){
            return  this.props.tasks.map(list=>{
                        return <>
                                <li key={list.id} style={{marginBottom:"10px",listStyle:"none"}}>
                                    <Card>
                                        <Card.Body>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-xs-8 col-9">{list.task}</div>
                                                <div className="col-xs-4 col-3">
                                                    <input name={list.id} type="checkbox" checked={list.done} onChange={this.handleChange} style={{marginRight:"5px"}} />
                                                    {/* Edit task */}
                                                    <OverlayTrigger delay={{show:50,hide:400}} overlay={<Tooltip>Edit</Tooltip>}>
                                                        <button name={list.id} style={{border:"none",background:"white"}} onClick={this.handleModal} className="fa fa-pencil"></button>
                                                    </OverlayTrigger>
                                                    {/* Delete atsk */}
                                                    <OverlayTrigger delay={{show:50,hide:400}} overlay={<Tooltip>Delete</Tooltip>}>
                                                        <button name={list.id} style={{border:"none",background:"white"}} className="fa fa-trash"></button>
                                                    </OverlayTrigger>
                                                </div>
                                            </div>
                                        </div>
                                        </Card.Body>
                                    </Card>
                                </li>

                                <Modal show={this.state.show} onHide={this.handleClose}>
                                    <ModalHeader closeButton>
                                        <ModalTitle>Edit Task</ModalTitle>
                                    </ModalHeader>
                                    <ModalBody>
                                        <label name="task"> Task:
                                            <input type="text" defaultValue={this.props.tasks[this.state.idx-1].task} onChange={this.handleEditTask}></input>
                                        </label>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="primary" onClick={this.handleSaveChanges}> Save Changes</Button>
                                        <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                                    </ModalFooter>
                                </Modal>
                            </>
                    });
        } //Display Tasks Completed
        else if(this.props.selectedTasks==="Done"){
            if(countDone){
                return this.props.tasks.map(list=>{
                    if(list.done===true){
                        return  <>
                                    <li key={list.id} style={{marginBottom:"10px",listStyle:"none"}}>
                                        <Card>
                                            <Card.Body>
                                                <div className="container">
                                                    <div className="row">
                                                        <div className="col-xs-8 col-9" >{list.task}</div>
                                                        <div className="col-xs-4 col-3" >
                                                            <input name={list.id} type="checkbox" checked={list.done} onChange={this.handleChange} style={{marginRight:"5px"}} />
                                                            {/* Edit task */}
                                                            <OverlayTrigger delay={{show:50,hide:400}} overlay={<Tooltip>Edit</Tooltip>}>
                                                                <button name={list.id} style={{border:"none",background:"white"}} onClick={this.handleModal} className="fa fa-pencil"></button>
                                                            </OverlayTrigger>
                                                            {/* Delete atsk */}
                                                            <OverlayTrigger delay={{show:50,hide:400}} overlay={<Tooltip>Delete</Tooltip>}>
                                                                <button name={list.id} style={{border:"none",background:"white"}} className="fa fa-trash"></button>
                                                            </OverlayTrigger>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>  
                                    </li>
    
                                    <Modal show={this.state.show} onHide={this.handleClose}>
                                        <ModalHeader closeButton>
                                            <ModalTitle>Edit Task</ModalTitle>
                                        </ModalHeader>
                                        <ModalBody>
                                            <label name="task"> Task:
                                                <input type="text" defaultValue={this.props.tasks[this.state.idx-1].task} onChange={this.handleEditTask}></input>
                                            </label>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button variant="primary" onClick={this.handleSaveChanges}> Save Changes</Button>
                                            <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                                        </ModalFooter>
                                    </Modal>
                                </>
                    } 
                });
            } return <img alt="Loser" src="https://img.freepik.com/free-photo/losers-go-home-portrait-happy-guy-showing-loser-sign-forehead-smiling-cause-victory-laughing-gray-background_155003-31355.jpg"
                    width="70%" height="25%" />
        }//Display Taks to Complete
        else{
            if(countTodo){
                return this.props.tasks.map(list=>{
                    if(list.done!==true){
                        return <>
                            <li key={list.id} style={{marginBottom:"10px",listStyle:"none"}}>
                                <Card>
                                    <Card.Body>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-xs-8 col-9" >{list.task}</div>
                                            <div className="col-xs-4 col-3" >
                                                <input name={list.id} type="checkbox" checked={list.done} onChange={this.handleChange} style={{marginRight:"5px"}} />
                                                {/* Edit task */}
                                                <OverlayTrigger delay={{show:50,hide:400}} overlay={<Tooltip>Edit</Tooltip>}>
                                                    <button name={list.id} style={{border:"none",background:"white"}} onClick={this.handleModal} className="fa fa-pencil"></button>
                                                </OverlayTrigger>
                                                {/* Delete atsk */}
                                                <OverlayTrigger delay={{show:50,hide:400}} overlay={<Tooltip>Delete</Tooltip>}>
                                                    <button name={list.id} style={{border:"none",background:"white"}} className="fa fa-trash"></button>
                                                </OverlayTrigger>
                                            </div>
                                        </div>
                                    </div>
                                    </Card.Body>
                                </Card>
                                
                            </li>

                            <Modal show={this.state.show} onHide={this.handleClose}>
                                <ModalHeader closeButton>
                                    <ModalTitle>Edit Task</ModalTitle>
                                </ModalHeader>
                                <ModalBody>
                                    <label name="task"> Task:
                                        <input type="text" defaultValue={this.props.tasks[this.state.idx-1].task} onChange={this.handleEditTask}></input>
                                    </label>
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="primary" onClick={this.handleSaveChanges}> Save Changes</Button>
                                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                    </>
                    }
                });
            }return <img alt="Get High" src="http://p.favim.com/orig/2018/11/02/spongebob-the-world-smoking-Favim.com-6479160.jpg"
                    width="70%" height="25%"/>
        }
            
    }
}

export default List;