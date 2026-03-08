import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: String,
    product: String,
    message: String
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);