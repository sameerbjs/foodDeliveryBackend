import express from "express";
import {
    addNewProduct,
    getProductDetail,
    getAllPosts,
    editProduct,
    deleteProduct,
} from "../controllers/ProductController.js";
import {productPicUpload} from "../controllers/ProductImageController.js";
import {authenticateToken} from "../controllers/jwt-controller.js";

const router = express.Router();

router.post(
    "/add-product",
    authenticateToken,
    productPicUpload.single("productPic"),
    addNewProduct
);
router.get("/get-all", authenticateToken, getAllPosts);
router.get("/get-product/:id", authenticateToken, getProductDetail);
router.post(
    "/edit-product/:id",
    authenticateToken,
    productPicUpload.single("productPic"),
    editProduct
);
router.delete("/delete-product/:id", authenticateToken, deleteProduct);

export default router;
