import express from "express";
import { authenticateToken } from "../controllers/jwt-controller.js";
import { postRating } from "../controllers/RatingController.js";


const router = express.Router();
router.post("/post-rating", postRating);

export default router;
