import Product from "../models/Product.js";

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      vendor: req.user.id, // ID from your auth middleware
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

// Get all products for a specific vendor
export const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.params.vendorId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Update an existing product (Needed for the Edit feature)
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // Returns the modified document rather than the original
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { vendor } = req.query; // Capture the ?vendor=ID from the URL
    const filter = vendor ? { vendor } : {}; // If vendor ID exists, filter by it

    const products = await Product.find(filter)
      .populate("vendor", "-password") 
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};