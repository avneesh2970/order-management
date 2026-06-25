import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Vendor", 
      required: true 
    },
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true,
      min: 0 
    },
    image: { 
      type: String,
      default: "" 
    },
    category: { 
      type: String, 
      default: "General",
      index: true 
    },
    stock: { 
      type: Number, 
      default: 0,
      min: 0
    },
  },
  { timestamps: true }
);

// Search optimization
productSchema.index({ name: 'text', category: 'text' });

const Product = mongoose.model("Product", productSchema);
export default Product;