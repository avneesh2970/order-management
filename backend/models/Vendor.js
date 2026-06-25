import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  companyName: { 
    type: String, 
    required: true,
    trim: true 
  },
  ownerName: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, // Ensures login is case-insensitive
    trim: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  streetAddress: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  pincode: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  logo: { 
    type: String,
    default: "" 
  }, 
  role: { 
    type: String, 
    enum: ["vendor", "admin"], 
    default: "vendor" 
  },
  status: { 
    type: String, 
    enum: ["pending", "active", "suspended"], 
    default: "pending"
  }
}, { timestamps: true });



const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;