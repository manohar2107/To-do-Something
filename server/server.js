import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    console.log(`📥 [GET] Root endpoint hit at ${new Date().toLocaleTimeString()}`);
  res.send('Server is up and running smoothly!!!');
});
let tasks = [
    {id: 101,task:"Backend server is officialy alive!",done:true},
    {id: 103,task:"Designing the UI for the app!",done:false},
    {id: 104,task:"Connecting the frontend and backend!",done:false},
  ];
app.get('/api/tasks', (  req, res) => {
    console.log(`📥 [GET] Fetching tasks list for client...`);
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const { task } = req.body;
    console.log(`📥 [POST] Adding new task: "${task}"`);
    const newTask = {
        id: Date.now(),
        task:task,
        done: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.patch('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task, done } = req.body;
    console.log(`📥 [PATCH] Updating task with ID: ${id}`);
    let targetTask = tasks.find(t => t.id === parseInt(id));
    if(!targetTask){
        return res.status(404).json({ message: "Task not found" });
    }
    if (task !== undefined) {
        targetTask.task = task;
    }
    if (done !== undefined) {
        targetTask.done = done;
    }
    res.json(targetTask);
});

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    console.log(`📥 [DELETE] Deleting task with ID: ${id}`);
    tasks = tasks.filter(t => t.id !== parseInt(id));
    res.json({ success: true, message: `Task with ID ${id} deleted successfully` });
});

app.post('/api/tasks/mass-delete', (req, res) => {
    const { type } = req.body;
    console.log(`📥 [POST] Mass delete request for type: ${type}`);
    if (type === 'Done') {
        tasks = tasks.filter(t => !t.done);
    } else if (type === 'All') {
        tasks = [];
    }
    res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server is running on port:  http://localhost:${PORT}`);
})