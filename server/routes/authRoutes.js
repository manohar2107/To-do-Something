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
        return res.status(400).json({ message: "PetName and ciggrete key are required" });
    }

    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(400).json({ message: "PetName already exists" });
    }

    const newUser = await User.create({username, password});

    return res.status(201).json({
        _id:newUser._id,
        username:newUser.username,
        theme:newUser.theme,
        token:genarateToken(newUser._id)
    });
}catch(err){
    console.error("Not Able to Register for the party :(", err);
    return res.status(500).json({ message: "Internal server error" });
}

    });

router.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body;
        if(!username || !password){
            return res.status(400).json({ message: "PetName and ciggrete key are required" });
        }

        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({ message: "PetName not found" });
        }

        if(user && (await user.comparePassword(password))){
            return res.status(200).json({
                _id:user._id,
                username:user.username,
                theme:user.theme,
                token:genarateToken(user._id)
            });
        }else{
            return res.status(400).json({ message: "Invalid ciggrete key" });
        }
    }catch(err){
        console.error("Not Able to Login the party :(", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/me', authenticateToken, async (req, res) => {
    try{
        res.status(200).json({
            _id:req.user._id,
            username:req.user.username,
            theme:req.user.theme,
        });
    }catch(err){
        console.error("Not Able to fetch user info :(", err);
        return res.status(500).json({ message: "Internal server error" });
    }   
});

export default router;