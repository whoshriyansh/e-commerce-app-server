import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/Product.controller.js";
import upload from "../middlewares/FileUpload.middleware.js";
import verifyToken from "../middlewares/Verify.middleware.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", verifyToken, upload.array("images", 5), createProduct); // max 5 images
router.put("/:id", verifyToken, upload.array("images", 5), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
