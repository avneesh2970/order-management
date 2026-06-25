import Vendor from "../models/Vendor.js";

export const getPendingVendors = async (req, res) => {
  try {
    const pending = await Vendor.find({ status: "pending", role: "vendor" }).select("-password");
    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getAllVendors = async (req, res) => {
  try {
    // This finds ALL vendors regardless of status
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateVendor = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  try {
    // 1. Validation for allowed status strings
    const allowedStatuses = ["active", "suspended", "pending"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status update requested." });
    }

    // 2. Security: Ensure we aren't modifying an Admin account through this route
    const target = await Vendor.findById(id);
    if (!target) return res.status(404).json({ msg: "Business entity not found" });
    
    if (target.role === "admin") {
      return res.status(403).json({ msg: "Admin accounts cannot be modified via this endpoint." });
    }

    // 3. Update the status
    target.status = status;
    await target.save();
    
    res.json({ 
      msg: `Business status successfully updated to ${status}`, 
      vendorId: id,
      newStatus: status 
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};