import { Router } from "express";

import {
  CreatingAnOrder,
  AddToCart,
  AddToWishlist,
  OrderHistory,
  GivingReview,
} from "../controllers/Order.controller.js";

import verifyToken from "../middlewares/Verify.middleware.js";

const router = Router();

// Order Routes
router.post("/", verifyToken, CreatingAnOrder);
router.get("/history", verifyToken, OrderHistory);

// Cart Routes
router.post("/cart", verifyToken, AddToCart);

// Wishlist Routes
router.post("/wishlist", verifyToken, AddToWishlist);

router.post("/review/:id", verifyToken, GivingReview);

export default router;
