import express from 'express';
import { Task } from '../models/Task.js'; // Adjust if your model uses a default export
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Enforce authentication across all task routes
router.use(authenticateToken);

// 1. Root task routes: GET all tasks, POST a new task
router
  .route('/')
  .get(async (req, res) => {
    try {
      const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch tasks: ' + err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const { task } = req.body;

      if (!task || !task.trim()) {
        return res.status(400).json({ error: 'Task content cannot be empty' });
      }

      const newTask = await Task.create({
        task: task.trim(),
        owner: req.user._id,
        done: false,
      });

      res.status(201).json(newTask);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create task: ' + err.message });
    }
  });

// 2. Mass operations (CRITICAL: Declared BEFORE /:id to prevent routing collision)
router
  .route('/mass-delete')
  .post( async (req, res) => {
  try {
    const { type } = req.body;
    // Normalize casing ("Done" -> "done", "All" -> "all")
    const mode = type ? type.toLowerCase() : '';

    let query = { owner: req.user._id };

    if (mode === 'done') {
      query.done = true;
    } else if (mode === 'all') {
      // Intentionally leave query as { owner: req.user._id }
    } else {
      return res.status(400).json({ error: 'Invalid delete type provided.' });
    }

    const result = await Task.deleteMany(query);

    res.json({
      message: 'Tasks cleared successfully',
      deletedCount: result.deletedCount,
      mode,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mass delete: ' + err.message });
  }
})
  .delete(async (req, res) => {
    // Fallback support if frontend dispatches standard DELETE
    try {
      const { type } = req.query;
      let query = { owner: req.user._id };

      if (type === 'done') {
        query = {
          owner: req.user._id,
          $or: [{ done: true }, { completed: true }],
        };
      }

      const result = await Task.deleteMany(query);
      res.json({
        message: 'Tasks cleared successfully',
        deletedCount: result.deletedCount,
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to mass delete: ' + err.message });
    }
  });

// 3. Individual task operations by ID
router
  .route('/:id')
  .patch(async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!task) {
        return res.status(404).json({ error: 'Task not found or unauthorized' });
      }

      res.json(task);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update task: ' + err.message });
    }
  })
  .put(async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!task) {
        return res.status(404).json({ error: 'Task not found or unauthorized' });
      }

      res.json(task);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update task: ' + err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id,
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found or unauthorized' });
      }

      res.json({ message: 'Task deleted successfully', id: req.params.id });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete task: ' + err.message });
    }
  });

export default router;