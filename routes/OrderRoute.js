import express from "express";
import { authenticateToken } from "../controllers/jwt-controller.js";
import { changeOrderStatus, getOrderDetail, getResturantAllOrders, placeOrder } from "../controllers/OrderController.js";

const router = express.Router();

router.post("/place-order", placeOrder);
router.get("/get-order/:id", getResturantAllOrders);
router.get("/get-order-detail/:id", getOrderDetail);
router.post("/order-status/:id", changeOrderStatus);

export default router;