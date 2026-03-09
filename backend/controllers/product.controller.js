import Product from "../models/Product.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {

        const imageUrls = req.files?.map(file => file.path) || [];

        let specifications = req.body.specifications;
        let whatsappNumbers = req.body.whatsappNumbers;
        let tableDat = req.body.table;

        if (typeof specifications === "string") {
            specifications = JSON.parse(specifications);
        }

        if (typeof whatsappNumbers === "string") {
            whatsappNumbers = JSON.parse(whatsappNumbers);
        }

        if (typeof tableData === "string") {
            tableData = JSON.parse(tableData);
        }

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            specifications,
            tableData,
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


// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
    try {

        const products = await Product.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// GET SINGLE PRODUCT
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

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// INCREASE PRODUCT VIEW
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

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


// UPDATE PRODUCT
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

        let specifications = req.body.specifications;
        let whatsappNumbers = req.body.whatsappNumbers;
        let tableData = req.body.tableData;

        if (typeof specifications === "string") {
            specifications = JSON.parse(specifications);
        }

        if (typeof whatsappNumbers === "string") {
            whatsappNumbers = JSON.parse(whatsappNumbers);
        }

        if (typeof tableData === "string") {
            tableData = JSON.parse(tableData);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                specifications,
                tableData,
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


// DELETE PRODUCT
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

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// DELETE PRODUCT IMAGE
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

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};