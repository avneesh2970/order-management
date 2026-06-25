import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 1. Try finding in both collections
      let account = await User.findById(decoded.id).select("-password") || 
                    await Vendor.findById(decoded.id).select("-password");

      if (!account) {
        return res.status(401).json({ msg: "Account no longer exists" });
      }

      // 2. The "Approval Gate"
      // Allow Admins through regardless of status
      // Users and Vendors must be "active"
      if (account.role !== "admin" && account.status !== "active") {
        return res.status(403).json({ 
          msg: account.role === "vendor" 
            ? "Your business application is pending approval." 
            : "Your account is currently inactive." 
        });
      }

      // 3. Attach standard user object to request
      req.user = {
        id: account._id,
        role: account.role,
        name: account.name || account.ownerName,
        status: account.status
      };
      
      next();
    } catch (error) {
      return res.status(401).json({ msg: "Token expired or invalid" });
    }
  } else {
    return res.status(401).json({ msg: "Not authorized, no token" });
  }
};

// Simple Admin Check Middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Access denied. Admin rights required." });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};