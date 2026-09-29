// server/middleware/authorizeDoc.js
import mongoose from 'mongoose';
import { Document } from '../models/Document.js';

export const authorizeDoc = (requiredRole = 'viewer') => {
  return async (req, res, next) => {
    try {
      // Find docId from req.params.id or req.params.docId
      const docId = req.params.id || req.params.docId;

      if (!mongoose.Types.ObjectId.isValid(docId)) {
        return res.status(400).json({ error: 'Invalid document ID format' });
      }

      const doc = await Document.findById(docId);
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }

      const userId = req.user._id.toString();
      const isOwner = doc.owner.toString() === userId;

      // 1. Owner has total control over everything
      if (isOwner) {
        req.userRole = 'owner';
        req.doc = doc;
        return next();
      }

      // 2. Check collaborator role
      const collaborator = doc.collaborators.find(
        (c) => (c.user._id || c.user).toString() === userId
      );

      if (!collaborator) {
        return res.status(403).json({ error: 'You do not have access to this document' });
      }

      // If route demands 'owner' (e.g. sharing, managing collaborators, deleting doc)
      if (requiredRole === 'owner') {
        return res.status(403).json({ error: 'Only the document owner can perform this action' });
      }

      // If route demands 'editor' (e.g. creating/editing/deleting tasks)
      if (requiredRole === 'editor' && collaborator.role !== 'editor') {
        return res.status(403).json({ error: 'Viewers cannot create, edit, or delete tasks' });
      }

      req.userRole = collaborator.role; // 'editor' or 'viewer'
      req.doc = doc;
      next();
    } catch (err) {
      console.error('[AUTH_DOC_ERROR]:', err);
      res.status(500).json({ error: 'Authorization error: ' + err.message });
    }
  };
};