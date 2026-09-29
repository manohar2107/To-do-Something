import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Na-Me is required.'],
      trim: true,
      default: 'Untitled List',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['viewer', 'editor'],
          default: 'editor',
        },
      },
    ],
  },
  { timestamps: true }
);

export const Document = mongoose.model('Document', documentSchema);