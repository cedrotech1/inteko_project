import db from "../database/models/index.js";
const {Products} = db;
// Add Product
export const addProduct = async (req, res) => {
  try {
    const { name,description } = req.body;
    const newProduct = await Products.create({ name,description });

    return res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
