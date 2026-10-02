import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken } from '../middleware/auth.js';
import * as TaskModule from '../models/Task.js';
import { authorizeDoc } from '../middleware/authorizeDoc.js';
import { Document } from '../models/Document.js';

// Resolves Task regardless of whether it's named (export const Task) or default (export default Task)
const Task = TaskModule.Task || TaskModule.default;

const router = express.Router();

// GET /api/tasks/doc/:docId
router.get('/doc/:docId', authenticateToken,authorizeDoc('viewer'), async (req, res) => {
  try {
    const { docId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.status(400).json({ error: `Invalid document ID: ${docId}` });
    }

    if (!Task || typeof Task.find !== 'function') {
      throw new Error("Task model is not properly imported or initialized.");
    }

    const tasks = await Task.find({ documentId: docId }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err) {
    // 🚨 Log directly to your Node terminal
    console.error('--- [TASK GET ROUTE ERROR] ---');
    console.error(err);
    console.error('------------------------------');

    return res.status(500).json({ 
      error: 'Failed to fetch tasks for this document',
      details: err.message 
    });
  }
});

// POST /api/tasks/doc/:docId
router.post('/doc/:docId', authenticateToken,authorizeDoc('editor'), async (req, res) => {
  try {
    const { docId } = req.params;
    const { task } = req.body;

    if (!task || !task.trim()) {
      return res.status(400).json({ error: 'Task text is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.status(400).json({ error: `Invalid document ID: ${docId}` });
    }

    const newTask = await Task.create({
      documentId: docId,
      task: task.trim(),
      createdBy: req.user._id,
      done: false,
    });

    return res.status(201).json(newTask);
  } catch (err) {
    console.error('[TASK CREATE ROUTE ERROR]:', err);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/doc/:docId/mass-delete', authenticateToken, authorizeDoc('editor'), async (req, res) => {
  try {
    const { docId } = req.params;
    const { type } = req.body; // 'All' or 'Done'

   const normalizedType = type ? type.toLowerCase() : '';
    if (!['all', 'done'].includes(normalizedType)) {
      return res.status(400).json({ error: 'Invalid delete type. Must be "all" or "done".' });
    }

    const filter = { documentId: docId };
    if (normalizedType === 'done') {
      filter.done = true;
    }
    
    const deletedTasks = await Task.deleteMany(filter);
    return res.status(200).json({ message: `${deletedTasks.deletedCount} tasks deleted successfully`, count: deletedTasks.deletedCount });  

  } catch (err) {
    console.error('[TASK MASS DELETE ERROR]:', err);
    return res.status(500).json({ error: 'Failed to delete tasks: ' + err.message });
  }
});

// PATCH /api/tasks/:id
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Lookup the parent document
    const doc = await Document.findById(task.documentId);
    if (!doc) {
      return res.status(404).json({ error: 'Parent workspace not found' });
    }

    const userId = req.user._id.toString();
    const isOwner = doc.owner.toString() === userId;
    const collaborator = doc.collaborators?.find(
      (c) => (c.user?._id || c.user)?.toString() === userId
    );
    const isEditor = collaborator && collaborator.role === 'editor';

    // BLOCK VIEWERS
    if (!isOwner && !isEditor) {
      return res.status(403).json({ error: 'Viewers cannot delete tasks from this workspace.' });
    }

    await Task.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Task deleted successfully', id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;