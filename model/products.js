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

const product = mongoose.model("products", productScheme);

export default product;
