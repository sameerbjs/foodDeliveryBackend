import express from "express";
import {
    addNewProduct,
    getProductDetail,
    getAllProduct,
    editProduct,
    deleteProduct,
    getTotalProductLength
} from "../controllers/ProductController.js";
import { productPicUpload } from "../controllers/ProductImageController.js";
import { authenticateToken } from "../controllers/jwt-controller.js";

const router = express.Router();

router.post(
    "/add-product",
    authenticateToken,
    productPicUpload.single("productPic"),
    addNewProduct
);
router.get("/get-all/:id", authenticateToken, getAllProduct);
router.get("/get-length", authenticateToken, getTotalProductLength);
router.get("/get-product/:id", authenticateToken, getProductDetail);
router.post(
    "/edit-product/:id",
    authenticateToken,
    productPicUpload.single("productPic"),
    editProduct
);
router.delete("/delete-product/:id", authenticateToken, deleteProduct);

export default router;
