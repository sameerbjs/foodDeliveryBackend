import mongoose from "mongoose";

const restScheme = mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        city: {
            type: String,
        },
        address: {
            type: String,
        },
        profilePic: {
            type: String,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        profilePath: {
            type: String,
        },
        isUser: {
            type: Boolean,
        },
        verificationToken: {
            type: String
        },
        verificationUrl: {
            type: String
        },
        isVerified: {
            type: Boolean,
        },
        ratings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rating',
        }],
    },
    { timestamps: true }
);
const Resturant = mongoose.model("Resturant", restScheme);

export default Resturant;
