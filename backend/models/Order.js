import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },

    customerName: String,
    customerEmail: String,
    customerPhone: String,
    shippingAddress: String,
    pincode: String,

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: Number,
    paidAmount: {
      type: Number,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Partially Paid', 'Paid'],
      default: 'Pending'
    },
    customerName:String,
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "in-transit", "out-for-delivery", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);