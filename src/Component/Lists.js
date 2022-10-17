import { Component } from "react";
import { Button, Card, Modal,ModalBody ,ModalFooter, ModalHeader, ModalTitle, OverlayTrigger, Tooltip } from "react-bootstrap";

function ListItem(props){
    return <li key={props.list.id} style={{marginBottom:"10px",listStyle:"none"}}>
                <Card>
                    <Card.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-8 col-9">{props.list.task}</div>
                            <div className="col-xs-4 col-3">
                                <input name={props.list.id} type="checkbox" checked={props.list.done} onChange={props.onHandleChange} style={{marginRight:"5px"}} />
                                {/* Edit task */}
                                <OverlayTrigger delay={{show:50,hide:400}} overlay={<Tooltip>Edit</Tooltip>}>
                                    <button name={props.list.id} style={{border:"none",background:"white"}} onClick={props.onHandleModal} className="fa fa-pencil"></button>
                                </OverlayTrigger>
                                {/* Delete atsk */}
                                <OverlayTrigger delay={{show:50,hide:400}} overlay={<Tooltip>Delete</Tooltip>}>
                                    <button name={props.list.id} style={{border:"none",background:"white"}} className="fa fa-trash" onClick={props.onHandleDelete}></button>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>
                    </Card.Body>
                </Card>
            </li>
}

function Edit(props){
    return <Modal show={props.show} onHide={props.onHandleClose}>
                <ModalHeader closeButton>
                    <ModalTitle>Edit Task</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <label name="task"> Task:
                        <input type="text" defaultValue={props.tasks[props.idx-1].task} onChange={props.onHandleEditTask}></input>
                    </label>
                </ModalBody>
                <ModalFooter>
                    <Button variant="primary" onClick={props.onHandleSaveChanges}> Save Changes</Button>
                    <Button variant="secondary" onClick={props.onHandleClose}>Cancel</Button>
                </ModalFooter>
            </Modal>
}

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
        this.handleDelete=this.handleDelete.bind(this);
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

    handleDelete(e){
        this.props.onHandleDeleteItem(e.target.name);
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
            if(countAll){
                return this.props.tasks.map(list=>{
                    return <>
                            <ListItem list={list} onHandleChange={this.handleChange} onHandleModal={this.handleModal} onHandleDelete={this.handleDelete} />

                            <Edit show={this.state.show} idx={this.state.idx} tasks={this.props.tasks}
                            onHandleClose={this.handleClose} onHandleEditTask={this.handleEditTask}
                            onHandleSaveChanges={this.handleSaveChanges} />
                        </>
            });
            }return <img alt="Add Tasks" src="https://www.orangescrum.com/blog/wp-content/uploads/2019/09/Google-Tasks-%E2%80%93-Your-Personal-Task-Manager.png"
            width="70%" />
        } //Display Tasks Completed
        else if(this.props.selectedTasks==="Done"){
            if(countDone){
                return this.props.tasks.map(list=>{
                    if(list.done===true){
                        return  <>
                                    <ListItem list={list} onHandleChange={this.handleChange} onHandleModal={this.handleModal} onHandleDelete={this.handleDelete} />
    
                                    <Edit show={this.state.show} idx={this.state.idx} tasks={this.props.tasks}
                                    onHandleClose={this.handleClose} onHandleEditTask={this.handleEditTask}
                                    onHandleSaveChanges={this.handleSaveChanges} />
                                </>
                    } 
                });
            } return <img alt="Loser" src="https://img.freepik.com/free-photo/losers-go-home-portrait-happy-guy-showing-loser-sign-forehead-smiling-cause-victory-laughing-gray-background_155003-31355.jpg"
                    width="70%"/>
        }//Display Taks to Complete
        else{
            if(countTodo){
                return this.props.tasks.map(list=>{
                    if(list.done!==true){
                        return <>
                            <ListItem list={list} onHandleChange={this.handleChange} onHandleModal={this.handleModal} onHandleDelete={this.handleDelete} />

                            <Edit show={this.state.show} idx={this.state.idx} tasks={this.props.tasks}
                                onHandleClose={this.handleClose} onHandleEditTask={this.handleEditTask}
                                onHandleSaveChanges={this.handleSaveChanges} />
                    </>
                    }
                });
            }return <img alt="Get High" src="http://p.favim.com/orig/2018/11/02/spongebob-the-world-smoking-Favim.com-6479160.jpg"
                    width="70%" height="25%"/>
        }
            
    }
}

export default List;