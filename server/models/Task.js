// server/models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true, // This correctly indexes the tasks by their parent document
    },
    task: {
      type: String,
      required: [true, 'Task is Preset!!!'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    done: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Removed the invalid owner/sharedWith index

export const Task = mongoose.model('Task', taskSchema);
export default Task; // Added default export so taskRoutes.js can import it reliably