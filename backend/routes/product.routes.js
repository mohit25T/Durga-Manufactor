import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  increaseProductView,
  createProductReview,
  deleteProductReview
} from "../controllers/product.controller.js";

import { verifyAdmin } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/*
  @route   GET /api/products
  @desc    Get all products
  @access  Public
*/
router.get("/", getProducts);

/*
  @route   GET /api/products/:id
  @desc    Get single product
  @access  Public
*/
router.get("/:id", getProductById);

/*
  @route   POST /api/products
  @desc    Create new product
  @access  Admin
*/
router.post(
  "/",
  verifyAdmin,
  upload.array("images", 5),   // allow up to 5 images
  createProduct
);

router.post("/:id/view", increaseProductView);

/*
  @route   POST /api/products/:id/reviews
  @desc    Create product review
  @access  Public
*/
router.post("/:id/reviews", createProductReview);

/*
  @route   DELETE /api/products/:id/reviews/:reviewId
  @desc    Delete product review
  @access  Admin
*/
router.delete("/:id/reviews/:reviewId", verifyAdmin, deleteProductReview);

/*
  @route   PUT /api/products/:id
  @desc    Update product
  @access  Admin
*/
router.put(
  "/:id",
  verifyAdmin,
  upload.array("images", 5),
  updateProduct
);

/*
  @route   DELETE /api/products/:id
  @desc    Delete product
  @access  Admin
*/
router.delete("/:id", verifyAdmin, deleteProduct);

router.delete("/:id/image", verifyAdmin, deleteProductImage);

export default router;