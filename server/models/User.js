import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    lowercase: true,
    },
    password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [7, "Password must be at least 7 characters long"],
  },
  theme: {
      type: String,
      default: 'dark', // 👈 Gives every new user a default theme
    },
}, { timestamps: true });

//pre-save hook to hash the password before saving the user document
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
}

export const User = mongoose.model("User", userSchema);