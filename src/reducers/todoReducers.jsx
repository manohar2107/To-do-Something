export const initialState = {
  tasks: [] // Clean slate from the beginning
};

export function todoReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload // Replace with fetched tasks from server
      };

    case 'ADD_TASK':
      if (!action.payload.trim()) {
        alert("Empty task like your life. Please make some choices!");
        return state;
      }
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: Date.now(), // Unique ID generation on creation
            task: action.payload,
            done: false
          }
        ]
      };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, done: !task.done } : task
        )
      };

    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, task: action.payload.newTask } : task
        )
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case 'MASS_DELETE':
      if (action.payload === "All") {
        return { ...state, tasks: [] };
      } else if (action.payload === "Done") {
        return { ...state, tasks: state.tasks.filter(task => !task.done) };
      }
      return state;

    default:
      return state;
  }
}