import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Array of user IDs who have shared access to this task
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    task: {
      type: String,
      required: [true, 'Content is required'],
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
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1, sharedWith: 1 });

export const Task = mongoose.model('Task', taskSchema);