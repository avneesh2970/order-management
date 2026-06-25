import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import generateToken from "../utils/generateToken.js";
import { hashPassword, matchPassword } from "../utils/hashPassword.js";
import nodemailer from "nodemailer";

const otpStore = new Map();

/**
 * @desc    Personal Tab Registration (Regular Users)
 * Updated to prevent users from signing up if they are already Vendors
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Check BOTH collections to prevent duplicate accounts across roles
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    const vendorExists = await Vendor.findOne({ $or: [{ email }, { phone }] });

    if (userExists || vendorExists) {
      return res.status(400).json({ msg: "An account already exists with this email/phone (User or Business)" });
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ 
      name, 
      email, 
      phone, 
      password: hashed, 
      role: "user",
      status: "active" 
    });

    res.status(201).json({
      token: generateToken(user),
      role: user.role,
      user: { name: user.name }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * @desc    Business Registration
 */
export const registerVendor = async (req, res) => {
  try {
    const { 
      companyName, ownerName, email, phone, 
      category, streetAddress, city, state, pincode, 
      password, image 
    } = req.body;

    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    // 1. STRICTOR CHECK: Ensure email doesn't exist in User OR Vendor models
    const userExists = await User.findOne({ email });
    const vendorExists = await Vendor.findOne({ email });
    
    if (userExists) {
       return res.status(400).json({ msg: "This email is already registered as a Personal User account." });
    }
    if (vendorExists) {
       return res.status(400).json({ msg: "This Business email is already registered." });
    }

    // 2. CATEGORY HANDLING: Parse stringified array from FormData
    let finalCategories = category;
    try {
      if (typeof category === 'string') {
        finalCategories = JSON.parse(category);
      }
    } catch (e) {
      finalCategories = category; // Fallback if it's already an array or plain string
    }

    // 3. IMAGE HANDLING: Prioritize file upload over URL link
    let finalLogo = image; 
    if (req.file) {
      // If using Cloudinary/S3, use req.file.path. If local, use req.file.filename
      finalLogo = req.file.path || req.file.filename; 
    }

    const hashed = await hashPassword(password);

    const newVendor = await Vendor.create({
      companyName,
      ownerName,
      email,
      phone,
      category: finalCategories, 
      streetAddress,
      city,
      state,
      pincode,
      password: hashed,
      logo: finalLogo || "", 
      role: "vendor",
      status: "pending" 
    });

    res.status(201).json({ 
      msg: "Application submitted successfully. Please wait for Admin approval." 
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    console.error("CRITICAL ERROR:", err); 
    res.status(500).json({ msg: "Internal Server Error: " + err.message });
  }
};

/**
 * @desc    Combined Login with Role Enforcement
 */
export const login = async (req, res) => {
  try {
    const { email, password, targetRole } = req.body; // targetRole: 'user' or 'vendor'

    let account = await User.findOne({ email });
    if (!account) {
      account = await Vendor.findOne({ email });
    }

    if (!account) return res.status(404).json({ msg: "Account not found" });

    // 1. Role Enforcement based on Tab Selection
    if (targetRole === "user" && (account.role === "vendor" || account.role === "admin")) {
      return res.status(401).json({ msg: "Please use the Business tab for Staff/Vendor login." });
    }
    if (targetRole === "vendor" && account.role === "user") {
      return res.status(401).json({ msg: "Please use the Personal tab for User login." });
    }

    // 2. Check Vendor Approval Status
    if (account.role === "vendor" && account.status === "pending") {
      return res.status(403).json({ 
        msg: "Your business account is pending approval." 
      });
    }

    // 3. Verify Password
    const isMatch = await matchPassword(password, account.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // THE FIX: Added email to the returned user object
    res.json({
      token: generateToken(account),
      role: account.role,
      user: { 
        name: account.name || account.ownerName,
        email: account.email, // <--- ADDED THIS LINE
        company: account.companyName || null
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * @desc    Forgot Password - Send OTP (Common for both User & Vendor)
 */
export const sendOTP = async (req, res) => {
  const { email } = req.body; // Removed 'role' from destructuring
  try {
    // 1. Search in both collections to find the account
    let account = await User.findOne({ email });
    let detectedRole = "user";

    if (!account) {
      account = await Vendor.findOne({ email });
      detectedRole = "vendor";
    }

    if (!account) {
      return res.status(404).json({ msg: "No account found with this email." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Store the OTP and the DETECTED role in the map
    otpStore.set(email, { 
      otp, 
      role: detectedRole, // We save the role here so resetPassword knows which table to update
      expires: Date.now() + 300000 
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"B2B Marketplace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
               <h3>Password Reset Request</h3>
               <p>Your OTP for password reset is: <b style="font-size: 20px; color: #10b981;">${otp}</b></p>
               <p>This code expires in 5 minutes.</p>
             </div>`
    });

    res.status(200).json({ msg: "OTP sent to your email." });
  } catch (error) {
    console.error("OTP Send Error:", error);
    res.status(500).json({ msg: "Email failed to send." });
  }
};

/**
 * @desc    Reset Password (Role is pulled automatically from otpStore)
 */
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = otpStore.get(email);

  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ msg: "Invalid or expired OTP" });
  }

  try {
    const hashedPassword = await hashPassword(newPassword);
    
    // Use the role we detected during the sendOTP phase
    const Model = record.role === "vendor" ? Vendor : User;

    await Model.findOneAndUpdate({ email }, { password: hashedPassword });

    // Clean up
    otpStore.delete(email);
    res.status(200).json({ msg: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ msg: "Reset failed." });
  }
};