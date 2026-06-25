import express from "express";
import multer from "multer";
import { 
  createVendor, 
  getVendors, 
  getVendorById,
  deleteVendor, 
  updateVendor 
} from "../controllers/vendor.controller.js";
import { protect } from "../middleware/auth.Middleware.js";
import { authorize } from "../middleware/role.Middleware.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });



// 2. Public/Shared Read Routes: Admins, Vendors, AND Users can see these
router.get("/all-vendors", getVendors);
router.get("/:id", getVendorById);

// 1. Authentication: Everyone must be logged in to see anything
router.use(protect);

// 3. Admin-Only Routes: Only Admins can create, delete, or update
// We apply the authorize middleware specifically to these routes
router.post("/create-vendor", authorize("admin"), upload.single("image"), createVendor);
router.delete("/:id", authorize("admin"), deleteVendor);
router.patch("/update/:id", authorize("admin"), updateVendor);

export default router;
