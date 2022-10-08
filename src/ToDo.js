import './App.css';
import { Component } from 'react';

class ToDO extends Component{
  constructor(props){
    super(props);
    this.state={
      tasks:[]
    }
  }
  render(){
    return (
      <div className="App">
        <h1>To-Do List</h1>
      </div>
    );
  }
}

export default ToDO;
