import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    resturant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resturant',
    },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
