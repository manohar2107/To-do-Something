import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Task } from './models/Task.js';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_database';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//     console.log(`📥 [GET] Root endpoint hit at ${new Date().toLocaleTimeString()}`);
//   res.send('Server is up and running smoothly!!!');
// });
// let tasks = [
//     {id: 101,task:"Backend server is officialy alive!",done:true},
//     {id: 103,task:"Designing the UI for the app!",done:false},
//     {id: 104,task:"Connecting the frontend and backend!",done:false},
//   ];

app.get('/api/tasks', async(  req, res) => {
    try{
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    }catch(err){
        console.error("Error fetching tasks:", err);
        res.status(500).json({ message: "Internal server error" });
    }
    // console.log(`📥 [GET] Fetching tasks list for client...`);
});

app.post('/api/tasks', async(req, res) => {
    try{
        const { task } = req.body;
        if(!task) return res.status(400).json({ message: "Task content is required" });
        // console.log(`📥 [POST] Adding new task: "${text}"`);
        const newTask = await Task.create({ task,done:false });
        console.log("💾 Saved to MongoDB:", newTask);
        res.status(201).json(newTask);
    }catch(err){
        console.error("Error adding task:", err);
        res.status(500).json({ message: "Internal server error" });
    }
    
});

app.patch('/api/tasks/:id', async(req, res) => {
    try{
        const { id } = req.params;
        const { task, done } = req.body;
        // console.log(`📥 [PATCH] Updating task with ID: ${id}`);
        const updates={};
        if(task !== undefined) updates.task = task;
        if(done !== undefined) updates.done = done;

        const targetTask = await Task.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
        if(!targetTask) return res.status(404).json({ message: "Task not found" });
        
        res.json(targetTask);
    }catch(err){
        console.error("Error updating task:", err);
        res.status(500).json({ message: "Internal server error" });
    }
    
});

app.delete('/api/tasks/:id', async(req, res) => {
    try{
        const { id } = req.params;
        // console.log(`📥 [DELETE] Deleting task with ID: ${id}`);
        const deletedTask = await Task.findByIdAndDelete(id);
        if(!deletedTask) return res.status(404).json({ message: "Task not found" });
        res.json({ success: true, message: `Task with ID ${id} deleted successfully` });
    }catch(err){
        console.error("Error deleting task:", err);
        res.status(500).json({ message: "Internal server error" });
    }
    
});

app.post('/api/tasks/mass-delete', async(req, res) => {
    try{
        const { type } = req.body;
        // console.log(`📥 [POST] Mass delete request for type: ${type}`);
        if (type === 'Done') {
            await Task.deleteMany({ done: true });
        } else if (type === 'All') {
            await Task.deleteMany({});
        }
        const remainingTasks = await Task.find().sort({ createdAt: -1 });
        res.json(remainingTasks);
        // res.json({ success: true, message: "Tasks deleted successfully" });
    }catch(err){
        console.error("Error processing mass delete request:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port:  http://localhost:${PORT}`);
})