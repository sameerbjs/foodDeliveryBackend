import express from "express";
import { authenticateToken } from "../controllers/jwt-controller.js";
import { changeOrderStatus, getOrderById, getOrderDetail, getResturantAllOrders, getUserAllOrders, placeOrder } from "../controllers/OrderController.js";

const router = express.Router();

router.post("/place-order", authenticateToken, placeOrder);
router.get("/get-order/:id", authenticateToken, getResturantAllOrders);
router.get("/get-order-detail/:id", authenticateToken, getOrderDetail);
router.post("/order-status/:id", authenticateToken, changeOrderStatus);
router.get("/order", authenticateToken, getOrderById);
router.get("/get-user-order/:id", authenticateToken, getUserAllOrders);

export default router;