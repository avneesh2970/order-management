import express from "express";
import { getAllUsers, deleteUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.Middleware.js";
import { authorize } from "../middleware/role.Middleware.js";
import { updateProfile} from '../controllers/user.controller.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
// Admin only: View all registered users (shows Name, Email, Phone, Date)
router.get("/", protect, authorize("admin"), getAllUsers);

// Admin only: Delete a user
router.delete("/:id", protect, authorize("admin"), deleteUser);


export default router;