import User from "../models/User.model.js";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import createError from "../middlewares/Error.middleware.js";
import Review from "../models/Review.model.js";

export const CreatingAnOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // Create the order
    const newOrder = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const savedOrder = await newOrder.save();

    // Update stock after the order
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    // Update the user's orders array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { orders: savedOrder._id } },
      { new: true } // to return the updated user
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (err) {
    next(err);
  }
};

export const AddToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product || product.stock < quantity) {
      return next(createError(400, "Product not available"));
    }

    const user = req.user;
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (err) {
    next(err);
  }
};

export const AddToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    const user = req.user;
    const isInWishlist = user.wishlist.includes(productId);

    if (isInWishlist) {
      return next(createError(400, "Product already in wishlist"));
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (err) {
    next(err);
  }
};

export const OrderHistory = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "orderItems.product"
    );

    if (!orders || orders.length === 0) {
      return next(createError(404, "No orders found"));
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

export const GivingReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params.id;

    // Check if the user has purchased this product
    const order = await Order.findOne({
      user: req.user._id,
      "orderItems.product": productId,
      isDelivered: true,
    });

    if (!order) {
      return next(createError(400, "You haven't purchased this product"));
    }

    // Create the review
    const review = new Review({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    await review.save();

    // Update product rating and review count
    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    product.reviews.push(review._id);
    product.reviewCount += 1;
    product.averageRating =
      (product.averageRating * (product.reviewCount - 1) + rating) /
      product.reviewCount;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (err) {
    next(err);
  }
};
