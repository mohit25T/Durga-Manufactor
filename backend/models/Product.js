import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        specifications: [
            {
                key: {
                    type: String,
                    required: true,
                    trim: true
                },
                value: {
                    type: String,
                    required: true,
                    trim: true
                }
            }
        ],

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

        // NEW FIELD (multiple whatsapp numbers)
        whatsappNumbers: [
            {
                type: String,
                trim: true
            }
        ]

    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;