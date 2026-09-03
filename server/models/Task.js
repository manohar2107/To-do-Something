import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: [true, "Task content is required"],
    trim: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true,
    toJson:{
        transform: function(doc, ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
 });

 export const Task = mongoose.model('Task', taskSchema);