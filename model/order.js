import mongoose from "mongoose";

const orderScheme = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            totalPrice: {
                type: Number,
                required: true,
            },
            rest_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Resturant',
            }
        },
    ],
    city: {
        type: String
    },
    overAllPrice : {
        type : Number
    },
    status: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderScheme);

export default Order;
