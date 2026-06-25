import express from "express";
import {
  createOrder,
  getUserOrders,
  getVendorOrders,
  updateOrderStatus,
  getOrderStats, // Add this import
} from "../controllers/order.controller.js";
import { getAllOrdersAdmin, deleteOrder } from "../controllers/order.controller.js";
import { protect, isAdmin } from "../middleware/auth.Middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/user", protect, getUserOrders);
router.get("/vendor", protect, getVendorOrders);

router.get("/stats", protect, getOrderStats); 

router.put("/:id", protect, updateOrderStatus);

router.get("/admin/all", protect, isAdmin, getAllOrdersAdmin);
router.delete("/:id", protect, isAdmin, deleteOrder);

export default router;