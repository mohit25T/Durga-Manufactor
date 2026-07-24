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