import express from "express";
import { authenticateToken } from "../controllers/jwt-controller.js";
import { getImage, uploadImage } from "../controllers/gridImageController.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.post("/upload-image", upload.single('image'), uploadImage);
router.get("/get-image/:filename", getImage);

export default router;