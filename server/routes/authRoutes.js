import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const genarateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'7d'});
}

router.post('/register', async (req, res) => {
    try{
        const { username, password } = req.body;

    if(!username || !password){
        return res.status(400).json({ error: "PetName and ciggrete key are required" });
    }

    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(400).json({ error: "PetName already exists" });
    }

    const newUser = await User.create({username, password});

    return res.status(201).json({
        _id:newUser._id,
        username:newUser.username,
        theme:newUser.theme || 'default',
        token:genarateToken(newUser._id)
    });
}catch(err){
    // Mongoose validation errors (e.g., password length < 7)
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join('. ') });
    }
    // Duplicate key safeguard
    if (err.code === 11000) {
      return res.status(400).json({ error: 'PetName is in use.' });
    }
    res.status(500).json({ error: 'Server error during registration.' });
}

    });

router.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body;
        if(!username || !password){
            return res.status(400).json({ error: "PetName and ciggrete key are required" });
        }

        const user = await User.findOne({username : username.toLowerCase()});
        if(!user){
            return res.status(400).json({ error: "PetName not found" });
        }

        if(user && (await user.comparePassword(password))){
            return res.status(200).json({
                _id:user._id,
                username:user.username,
                theme:user.theme || 'default',
                token:genarateToken(user._id)
            });
        }else{
            return res.status(400).json({ error: "Invalid ciggrete key" });
        }
    }catch(err){
        console.error("Not Able to Login the party :(", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/me', authenticateToken, async (req, res) => {
    try{
        res.status(200).json({
            _id:req.user._id,
            username:req.user.username,
            theme:req.user.theme || 'default',
        });
    }catch(err){
        console.error("Not Able to fetch user info :(", err);
        return res.status(500).json({ message: "Internal server error" });
    }   
});

// Update User Theme Preference
router.patch('/theme', authenticateToken, async (req, res) => {
  try {
    const { theme } = req.body;
    const allowedThemes = ['default', 'dark', 'indigo'];

    if (!allowedThemes.includes(theme)) {
      return res.status(400).json({ error: `Invalid theme. Must be one of: ${allowedThemes.join(', ')}` });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { theme },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Theme updated successfully',
      theme: updatedUser.theme,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update theme: ' + err.message });
  }
});

export default router;