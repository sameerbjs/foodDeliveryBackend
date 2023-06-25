import express from "express";
import Connection from "./db/dbConnect.js";
import dotenv from "dotenv";
import cors from "cors";
import resturantRoute from "./routes/RestRoute.js";
import productRoute from "./routes/ProductRoute.js";
import userRoute from "./routes/UserRoute.js";
import ratingRoute from "./routes/RatingRoute.js"
import orderRoute from "./routes/OrderRoute.js"
import lenghtRoute from "./routes/ItemLenghtRoute.js"

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

// test

app.get('/test', (req,res) => res.status(200).send({message : 'Welcome to our website'}))

// image access
app.use("/uploads", express.static("uploads"));

// resturant
app.use("/api", resturantRoute);

// products
app.use("/api", productRoute);

// users
app.use("/api", userRoute);

// ratings
app.use("/api", ratingRoute);

// orders
app.use("/api", orderRoute);

// items length
app.use("/api", lenghtRoute);

const PORT = process.env.SERVER_PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const mongoURL = process.env.DB_CONNECT_URL;

Connection(mongoURL);
