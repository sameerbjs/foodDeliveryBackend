import mongoose from "mongoose";

const productScheme = mongoose.Schema(
    {
        rest_id: {
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
        price: {
            type: String,
        },
        category: {
            type: String,
        },
        quantity: {
            type: Number,
        },
        productPic: {
            type: String,
        },
        productPath: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    {timestamps: true}
);

const Product = mongoose.model("Product", productScheme);

export default Product;
