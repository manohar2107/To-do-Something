import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { Document } from '../models/Document.js';
import { User } from '../models/User.js';
import  Task  from '../models/Task.js';
import { authorizeDoc } from '../middleware/authorizeDoc.js';

const router = express.Router();

// // Middleware: Check document read/write authorization
// const authorizeDoc = (requiredRole = 'viewer') => async (req, res, next) => {
//   try {
//     const doc = await Document.findById(req.params.id);
//     if (!doc) return res.status(404).json({ error: 'Document not found' });

//     const userId = req.user._id.toString();
//     const isOwner = doc.owner.toString() === userId;
//     const collaborator = doc.collaborators.find((c) => c.user.toString() === userId);

//     if (isOwner) {
//       req.doc = doc;
//       req.userRole = 'owner';
//       return next();
//     }

//     if (!collaborator) {
//       return res.status(403).json({ error: 'Access denied to this document' });
//     }

//     if (requiredRole === 'editor' && collaborator.role !== 'editor') {
//       return res.status(403).json({ error: 'Write permission required' });
//     }

//     req.doc = doc;
//     req.userRole = collaborator.role;
//     next();
//   } catch (err) {
//     res.status(500).json({ error: 'Authorization error: ' + err.message });
//   }
// };

// 1. Get all documents accessible to the user (owned + shared)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const docs = await Document.find({
      $or: [{ owner: req.user._id }, { 'collaborators.user': req.user._id }],
    })
      .populate('owner', 'username')
      .populate('collaborators.user', 'username')
      .sort({ updatedAt: -1 });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve documents' });
  }
});

// 2. Create a new document
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    const doc = await Document.create({
      title: title || 'Untitled List',
      owner: req.user._id,
      collaborators: [],
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Share document with another user by username
router.post('/:id/share', authenticateToken, authorizeDoc('owner'), async (req, res) => {
  try {
    const { username, role = 'editor' } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required to share' });
    }

    const targetUser = await User.findOne({ username: username.toLowerCase().trim() });
    if (!targetUser) {
      return res.status(404).json({ error: 'Required user does not exist' });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'You are already the owner of this document' });
    }

    const doc = req.doc;
    const existingIndex = doc.collaborators.findIndex(
      (c) => c.user.toString() === targetUser._id.toString()
    );

    if (existingIndex > -1) {
      doc.collaborators[existingIndex].role = role; // Update role if already shared
    } else {
      doc.collaborators.push({ user: targetUser._id, role });
    }

    await doc.save();
    await doc.populate('collaborators.user', 'username');

    res.json({ message: `Document shared with ${username}`, collaborators: doc.collaborators });
  } catch (err) {
    res.status(500).json({ error: 'Failed to share document: ' + err.message });
  }
});

// 4. Update document title
router.patch('/:id', authenticateToken, authorizeDoc('editor'), async (req, res) => {
  try {
    req.doc.title = req.body.title || req.doc.title;
    await req.doc.save();
    res.json(req.doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update document title' });
  }
});

// 5. Delete document (Owner only)
router.delete('/:id', authenticateToken, authorizeDoc('owner'), async (req, res) => {
  try {
    await Task.deleteMany({ documentId: req.doc._id }); // Cascade delete related tasks
    await req.doc.deleteOne();
    res.json({ message: 'Document and its tasks deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// server/routes/documentRoutes.js

// 1. PATCH /api/documents/:id/collaborators/:userId -> Update Role (editor/viewer)
router.patch('/:id/collaborators/:userId', authenticateToken, authorizeDoc('owner'), async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { role } = req.body;

    if (!['editor', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either editor or viewer' });
    }

    const doc = await Document.findOneAndUpdate(
      { _id: id, 'collaborators.user': userId },
      { $set: { 'collaborators.$.role': role } },
      { new: true }
    ).populate('collaborators.user', 'username');

    if (!doc) return res.status(404).json({ error: 'Document or collaborator not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. DELETE /api/documents/:id/collaborators/:userId -> Remove Collaborator
router.delete('/:id/collaborators/:userId', authenticateToken, authorizeDoc('owner'), async (req, res) => {
  try {
    const { id, userId } = req.params;

    const doc = await Document.findByIdAndUpdate(
      id,
      { $pull: { collaborators: { user: userId } } },
      { new: true }
    ).populate('collaborators.user', 'username');

    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;