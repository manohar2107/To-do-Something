// server/routes/userRoutes.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {User} from '../models/User.js';

const router = express.Router();

// GET /api/users - Fetch active users for collaborator invite dropdown
router.get('/', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Fetch all users except the current authenticated user
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('username _id')
      .sort({ username: 1 });

    res.json(users);
  } catch (err) {
    console.error('[FETCH_USERS_ERROR]:', err);
    res.status(500).json({ error: 'Failed to fetch users list' });
  }
});

export default router;