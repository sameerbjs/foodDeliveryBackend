import mongoose from "mongoose";

const Connection = async (mongoURL) => {
    try {
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.log("error while connection db", error);
    }
};

export default Connection;
