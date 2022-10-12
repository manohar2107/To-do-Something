import './App.css';
import { Component } from 'react';
import ToDoInput from './Component/ToDoInput';

class ToDO extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <>
      <div className='App'>
        <ToDoInput />
      </div>
      </>
    );
  }
}

export default ToDO;
