import User from "../models/User.js";

// Admin view: Get all users
// controllers/user.controller.js
export const getAllUsers = async (req, res) => {
  try {
    // Explicitly select the fields to be 100% sure
    const users = await User.find()
      .select("name email phone role createdAt") 
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin action: Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      const updatedUser = await user.save();

      // Return the structure AuthContext expects
      res.json({
        token: req.headers.authorization.split(" ")[1], // Keep existing token
        role: updatedUser.role,
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
        }
      });
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    // 1. Corrected req.user.id (matches your middleware)
    // 2. We check BOTH collections if you want one profile endpoint for everyone
    let user = await User.findById(req.user.id).populate('orders').populate('vendors');
    
    // If not found in User, it might be a Vendor
    if (!user) {
      user = await Vendor.findById(req.user.id);
    }

    if (user) {
      res.json(user);
    } else {
      // This is the 404 you are seeing in the console
      res.status(404).json({ message: "Account data not found in database" });
    }
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: error.message });
  }
};