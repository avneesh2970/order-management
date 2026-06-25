import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, customerName, customerEmail, customerPhone, pincode } = req.body;

    const vendorId = items[0]?.vendor;

    const order = await Order.create({
      user: req.user.id,
      vendor: vendorId || req.body.vendor,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      pincode,
      items,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: "Error creating order", error: error.message });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .populate("vendor", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user orders", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    // Destructured fields from the B2B Modal
    const { status, items, totalAmount, paidAmount, paymentStatus, customerName } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Identify who is making the request
    const isOwner = order.user.toString() === req.user.id.toString();
    const isVendor = order.vendor && order.vendor.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';

    // 1. Updated Permission Logic for Item/Amount Edits
    if (items || totalAmount || customerName) {
      // FIX: Allow either the Buyer, the assigned Vendor, or an Admin
      if (!isOwner && !isVendor && !isAdmin) {
        return res.status(403).json({ message: "Permission denied: Only involved parties can update ledger" });
      }

      // Restrict buyer edits to 'pending' state, but allow Vendor/Admin to update ledger anytime
      if (order.status !== 'pending' && isOwner && !isAdmin) {
        return res.status(400).json({ message: "Order can only be edited by user while pending" });
      }

      if (items) order.items = items;
      if (totalAmount) order.totalAmount = totalAmount;
      if (customerName) order.customerName = customerName;
    }

    // 2. Logic for Status Updates
    if (status) {
      order.status = status;
    }

    // 3. Logic for Payment Tracking (Vendor Ledger)
    if (paidAmount !== undefined) {
      order.paidAmount = paidAmount;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();

    // Re-populate for the frontend response to avoid breaking UI components
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate("items.product")
      .populate("vendor", "companyName");

    res.json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

export const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.id }).populate("items.product").populate("vendor", "companyName phone email");;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendor orders", error: error.message });
  }
};



export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      deliveredOrders: 0
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

// --- GET ALL ORDERS (ADMIN) ---
export const getAllOrdersAdmin = async (req, res) => {
  try {
    // Populate both 'vendor' (for business name) and 'user' (for buyer details)
    const orders = await Order.find()
      .populate("vendor", "companyName email phone")
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};



// Delete Order (Admin Only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};