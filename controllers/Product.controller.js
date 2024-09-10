import Product from "../models/Product.model.js";
import createError from "../middlewares/Error.middleware.js";
import Order from "../models/Order.model.js";

//Create a New Product
export const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, brand, stock, features } =
      req.body;

    const images = req.files.map((file) => file.path);

    console.log(req.files);

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      brand,
      stock,
      features: features.split(","),
      images,
    });

    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "New Product Created Successfully",
      product: newProduct,
    });
  } catch (err) {
    next(err);
  }
};

//Get All Products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("category").exec();
    res.status(200).json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

//Get Products with ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .exec();

    if (!product) {
      return next(createError(404, "Product not found"));
    }
    res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

//Update Product
export const updateProduct = async (req, res, next) => {
  try {
    const updatedData = { ...req.body };
    if (req.files) {
      updatedData.images = req.files.map((file) => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    if (!updatedProduct) {
      return next(createError(404, "Product not found"));
    }
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (err) {
    next(err);
  }
};

// Delete a product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(createError(404, "Product not found"));
    }
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
