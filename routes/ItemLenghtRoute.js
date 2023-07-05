import express from "express";
import Product from "../model/products.js";
import Order from "../model/order.js";


const router = express.Router();

router.get("/get-length/:id", async (req, res) => {
    try {
        const { id } = req.params
        // Count the total number of items in the collection
        const totalProducts = await Product.find({ rest_id: id });
        let orders = await Order.find({}).populate({
            path: "products.product",
        });
        orders = orders.filter((order) => {
            return order.products.some(
                (item) => item.product.rest_id === id
            );
        });;

        res.status(200).send({ totalProducts: totalProducts.length, totalOrders: orders.length });
    } catch (error) {
        res.status(500).send({ error: 'Failed to get total items', err : error.message });
    }
})

export default router;