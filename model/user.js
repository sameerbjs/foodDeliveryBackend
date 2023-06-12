import mongoose from "mongoose";

const userScheme = mongoose.Schema(
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
        address: {
            type: String,
        },
        dob: {
            type: Date,
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
        }

    },
    { timestamps: true }
);
const user = mongoose.model("users", userScheme);

export default user;
