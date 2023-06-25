import express from "express";
import Product from "../model/products.js";
import Order from "../model/order.js";


const router = express.Router();

router.get("/get-length/:id", async (req, res) => {
    try {
        const { id } = req.params.id
        // Count the total number of items in the collection
        const totalProducts = await Product.find({ id: id }).countDocuments();
        const totalOrders = await Order.find({ id: id }).countDocuments();

        res.status(200).send({ totalProducts,totalOrders });
    } catch (error) {
        res.status(500).send({ error: 'Failed to get total items' });
    }
})

export default router;