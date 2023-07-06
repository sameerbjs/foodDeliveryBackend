import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    rating: {
        type: Number,
    },
    comment: {
        type: String,
    },
    resturant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resturant',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
