import express from "express";
import { 
  login, 
  registerUser, 
  registerVendor, 
  sendOTP, 
  resetPassword 
} from "../controllers/auth.controller.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Public routes - NO PROTECTION NEEDED
router.post("/login", login);
router.post("/register", registerUser);
router.post("/register-vendor", upload.single("image"), registerVendor);
router.post("/send-otp", sendOTP);
router.post("/reset-password", resetPassword);

export default router;