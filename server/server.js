import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Task } from './models/Task.js';
import dns from 'node:dns';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Catch malformed JSON before it crashes routes
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON payload received' });
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_database';



// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Connected to Database: "${conn.connection.name}"`);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port:  http://localhost:${PORT}`);
})