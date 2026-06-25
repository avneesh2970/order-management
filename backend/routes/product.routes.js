import express from "express";
import {
  addProduct,
  getVendorProducts,
  deleteProduct,
  updateProduct,getProducts
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.Middleware.js"; // Standardized middleware

const router = express.Router();
router.get("/", getProducts);
router.post("/", protect, addProduct);

router.get("/:vendorId", getVendorProducts);

router.put("/:id", protect, updateProduct);

router.delete("/:id", protect, deleteProduct);

export default router;