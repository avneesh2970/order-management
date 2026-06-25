import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  }, 
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true,
    trim: true 
  },
  role: { 
    type: String, 
    enum: ['user'], 
    default: 'user' 
  },
  status: { 
    type: String, 
    enum: ['active', 'pending', 'suspended'], 
    default: 'active'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });



const User = mongoose.model('User', userSchema);
export default User;