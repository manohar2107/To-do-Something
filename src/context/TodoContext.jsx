import React, {createContext,useReducer} from "react";

import {todoReducer,initialState} from "../reducers/todoReducers";

export const TodoContext = createContext();

export function TodoProvider({children}){
    const [state, dispatch] = useReducer(todoReducer, initialState);
    return(
        <TodoContext.Provider value={{tasks: state.tasks, dispatch}}>
            {children}
        </TodoContext.Provider>
    );
}