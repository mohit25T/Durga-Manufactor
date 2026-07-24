import Product from "../models/Product.js";

/* =========================
   CREATE PRODUCT
========================= */

export const createProduct = async (req, res) => {
  try {

    const imageUrls = req.files?.map(file => file.path) || [];

    let table = req.body.table;
    let whatsappNumbers = req.body.whatsappNumbers;

    if (typeof table === "string") {
      table = JSON.parse(table);
    }

    if (typeof whatsappNumbers === "string") {
      whatsappNumbers = JSON.parse(whatsappNumbers);
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      table,
      category: req.body.category,
      price: req.body.price,
      whatsappNumbers,
      images: imageUrls
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* =========================
   GET ALL PRODUCTS
========================= */

export const getProducts = async (req, res) => {
  try {

    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* =========================
   GET SINGLE PRODUCT
========================= */

export const getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* =========================
   INCREASE PRODUCT VIEW
========================= */

export const increaseProductView = async (req, res) => {
  try {

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { views: 1 } },
      { returnDocument: "after" }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "View counted",
      views: product.views,
    });

  } catch (error) {
    console.error("INCREASE PRODUCT VIEW ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


/* =========================
   UPDATE PRODUCT
========================= */

export const updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const imageUrls = req.files?.map(file => file.path) || [];

    const updatedImages = [
      ...product.images,
      ...imageUrls
    ];

    let table = req.body.table;
    let whatsappNumbers = req.body.whatsappNumbers;

    if (typeof table === "string") {
      table = JSON.parse(table);
    }

    if (typeof whatsappNumbers === "string") {
      whatsappNumbers = JSON.parse(whatsappNumbers);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        table,
        category: req.body.category,
        price: req.body.price,
        whatsappNumbers,
        images: updatedImages
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* =========================
   DELETE PRODUCT
========================= */

export const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* =========================
   DELETE PRODUCT IMAGE
========================= */

export const deleteProductImage = async (req, res) => {
  try {

    const { id } = req.params;
    const { imageUrl } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.images = product.images.filter(img => img !== imageUrl);

    await product.save();

    res.json({
      success: true,
      message: "Image deleted successfully",
      data: product
    });

  } catch (error) {
    console.error("DELETE PRODUCT IMAGE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/* =========================
   CREATE PRODUCT REVIEW
========================= */

export const createProductReview = async (req, res) => {
  try {
    const { name, city, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (!name || !city || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, city, rating and comment"
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    const review = {
      name: name.trim(),
      city: city.trim(),
      rating: numRating,
      comment: comment.trim()
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: product
    });

  } catch (error) {
    console.error("CREATE PRODUCT REVIEW ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =========================
   DELETE PRODUCT REVIEW
========================= */

export const deleteProductReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== reviewId
    );

    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.length === 0
        ? 0
        : product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message: "Review deleted successfully",
      data: product
    });

  } catch (error) {
    console.error("DELETE PRODUCT REVIEW ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};