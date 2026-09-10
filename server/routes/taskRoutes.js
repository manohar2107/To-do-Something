import express from 'express';
import {Task} from '../models/Task.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken); // Apply authentication middleware to all routes in this router

// GET /api/tasks - Get all tasks  
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({
        $or:[{owner:req.user._id},{sharedWith:req.user._id }],
    }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
    } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Internal server error " + err.message });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  try {
    const { task ,imageURL} = req.body;
    if (!task) return res.status(400).json({ message: "please provide an useful activity" });

    const newTask= await Task.create({task,imageURL:imageURL||null,done:false,owner:req.user._id,sharedWith:[]});

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ message: "Internal server error " + err.message });
  }
});

router.put('/:id', async (req, res) => {
    try {
        const task  = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const isOwner = task.owner.toString() === req.user._id.toString();
        const isSharedWithUser = task.sharedWith.some(userId => userId.toString() === req.user._id.toString());

        if (!isOwner && !isSharedWithUser) {
            return res.status(403).json({ message: 'Bad Elements of Soceity' });
        }

        if(req.body.task !== undefined) task.task = req.body.task;
        if(req.body.done !== undefined) task.done = req.body.done;

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ message: "Internal server error " + err.message });
    }
}); 

router.delete('/all', async (req, res) => {
  try {
    const result = await Task.deleteMany({ owner: req.user._id });
    res.status(200).json({ message: `${result.deletedCount} tasks deleted successfully` });
    } catch (error) {
    console.error("Error deleting all tasks:", error);
    res.status(500).json({ message: "Internal server error " + error.message });
  }
});

router.delete('/done', async (req, res) => {
  try {
    const result = await Task.deleteMany({ owner: req.user._id, done: true });  
    res.status(200).json({ message: `${result.deletedCount} completed tasks deleted successfully` });
  } catch (error) {
    console.error("Error deleting done tasks:", error);
    res.status(500).json({ message: "Internal server error " + error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isOwner = task.owner.toString() === req.user._id.toString();
    // const isSharedWithUser = task.sharedWith.some(userId => userId.toString() === req.user._id.toString());

    if (!isOwner) {
      return res.status(403).json({ message: 'Bad Elements of Soceity' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task: ' + error.message });
  }
});

export default router;