import express from "express";
import {
    addNewProduct,
    getProductDetail,
    getAllProduct,
    editProduct,
    deleteProduct,
} from "../controllers/ProductController.js";
import { authenticateToken } from "../controllers/jwt-controller.js";

const router = express.Router();

router.post(
    "/add-product",
    authenticateToken,
    addNewProduct
);
router.get("/get-all/:id", authenticateToken, getAllProduct);
router.get("/get-product/:id", authenticateToken, getProductDetail);
router.post(
    "/edit-product/:id",
    authenticateToken,
    editProduct
);
router.delete("/delete-product/:id", authenticateToken, deleteProduct);

export default router;
