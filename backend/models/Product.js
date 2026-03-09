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
        ]

    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;