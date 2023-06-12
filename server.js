import express from "express";
import Connection from "./db/dbConnect.js";
import dotenv from "dotenv";
import cors from "cors";
import resturantRoute from "./routes/RestRoute.js";
import productRoute from "./routes/ProductRoute.js";
import userRoute from "./routes/UserRoute.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

// image access
app.use("/uploads", express.static("uploads"));

// resturant
app.use("/api", resturantRoute);

// products
app.use("/api", productRoute);

// users
app.use("/api", userRoute)

const PORT = process.env.SERVER_PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const mongoURL = process.env.DB_CONNECT_URL;

Connection(mongoURL);
