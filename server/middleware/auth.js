import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Entry Pass(Access Token) required!!! ' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔍 Decoded Token Payload:', decoded);
    const user = await User.findById(decoded.id).select('-password'); // Exclude password from the user object
    if (!user) {
      return res.status(404).json({ message: 'OOPs...! You are not in out bucketlist' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Expired Token' });
  }
};