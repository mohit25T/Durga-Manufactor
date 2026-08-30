import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

const supplierPriceSchema = new mongoose.Schema(
    {
        supplierId: { type: String, default: "" },
        supplierName: { type: String, default: "" },
        price: { type: Number, required: true, min: 0 },
        minQuantity: { type: Number, default: 1 },
        notes: { type: String, default: "" },
        updatedAt: { type: Date, default: Date.now }
    },
    { _id: true }
);

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        /* MACHINE SPECIFICATION TABLE */

        table: {
            type: [[String]],
            default: []
        },

        views: {
            type: Number,
            default: 0
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            min: 0
        },

        /* Hidden App-only Machine Wholesale Price (Set by Admin, Not shown on website) */
        appPrice: {
            type: Number,
            min: 0
        },

        /* Supplier-Specific Wholesale / Cost Rates */
        supplierPrices: [supplierPriceSchema],

        images: [
            {
                type: String
            }
        ],

        whatsappNumbers: [
            {
                type: String,
                trim: true
            }
        ],

        reviews: [reviewSchema],

        averageRating: {
            type: Number,
            default: 0
        },

        numReviews: {
            type: Number,
            default: 0
        }

    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;