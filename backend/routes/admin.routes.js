// routes/admin.routes.js
import express from "express";
import { protect, adminOnly } from "../middleware/auth.Middleware.js";
import { 
  getPendingVendors, 
  updateVendor, 
  getAllVendors // <--- Add this controller method
} from "../controllers/admin.controller.js";

const router = express.Router();

// Get ALL vendors for the directory
router.get("/all-vendors", protect, adminOnly, getAllVendors); 

// Existing routes
router.get("/pending-vendors", protect, adminOnly, getPendingVendors);
router.patch("/vendor-status/:id", protect, adminOnly, updateVendor);

export default router;