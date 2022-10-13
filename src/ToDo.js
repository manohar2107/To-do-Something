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
    } alert(`Empty task like your life. Please make some choices!`)
  }

  handleCheck(val){
    const arr=this.state.tasks;
    const check=arr[val-1].done;
    arr[val-1].done=!check;
    this.setState({
      tasks:arr
    })
  }

  render(){
    return (
      <>
      <div className='App'>
        <ToDoInput onAddingTask={this.handleAddingTask} />
        <ToDoList  tasks={this.state.tasks} onChangingCheck={this.handleCheck}/>
      </div>
      </>
    );
  }
}

export default ToDO;
