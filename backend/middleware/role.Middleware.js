/**
 * @desc    General Role Authorization
 * Usage:   router.get("/orders", protect, authorize("admin", "vendor"))
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: `Access denied. Role '${req.user.role}' is not authorized.` 
      });
    }
    next();
  };
};

/**
 * @desc    Quick helper for Admin-only routes
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Admin access required" });
  }
};