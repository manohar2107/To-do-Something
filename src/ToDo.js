import './App.css';
import { Component } from 'react';
import ToDoInput from './Component/ToDoInput';
import ToDoList from './Component/ToDoList';

// let tasks=[{task:"Get your shit together",id:1,done:false},{task:"Built this app",id:2,done:true},{task:"Get away from here.",id:3,done:false}];

class ToDO extends Component{
  constructor(props){
    super(props);
    this.state={
      tasks:[{task:"Get your shit together",id:1,done:false},{task:"Built this app",id:2,done:false},{task:"Cannot achieve Nirvana.",id:3,done:true}]
    }
    this.handleAddingTask=this.handleAddingTask.bind(this);
    this.handleCheck=this.handleCheck.bind(this);
    this.handleChangedTask=this.handleChangedTask.bind(this);
    this.handleDelete=this.handleDelete.bind(this);
    this.handleDeleteTask=this.handleDeleteTask.bind(this);
  }

  handleAddingTask(val){
    
    if(val){
      const len=this.state.tasks.length;
      let arr=this.state.tasks;
      arr.push({
        task:val,
        id:len+1,
        done:false
      });
      this.setState({
        tasks:arr
      });
    }else alert(`Empty task like your life. Please make some choices!`)
  }

  handleCheck(val){
    const arr=this.state.tasks;
    const check=arr[val-1].done;
    arr[val-1].done=!check;
    this.setState({
      tasks:arr
    })
  }

  handleChangedTask(val){
    this.setState({
      tasks:val
    });
  }

  handleDelete(val){
    const idx=parseInt(val);
    let arr=this.state.tasks,n=1;
    arr.splice(idx-1,1);
    arr.forEach(element => {
      element.id=n;
      n++;
    });

    this.setState({
      tasks:arr
    })
  }

  handleDeleteTask(val){
    let arr=this.state.tasks;
    if(val==="All"){
      arr.splice(0,arr.length);
      this.setState({
        tasks:arr
      });
    }else{
      var filtered=arr.filter((value)=>{return value.done===false});
      this.setState({
        tasks:filtered
      });
    }
  }

  render(){
    return (
      <>
      <div className='App'>
        <ToDoInput onAddingTask={this.handleAddingTask} />
        <ToDoList  tasks={this.state.tasks}
         onChangingCheck={this.handleCheck}
         onChangingTask={this.handleChangedTask}
         onHandleDeleteListItem={this.handleDelete}
         onHandleDeleteTasks={this.handleDeleteTask}/>
      </div>
      </>
    );
  }
}

export default ToDO;
