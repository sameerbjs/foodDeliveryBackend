import express from "express";
import { authenticateToken } from "../controllers/jwt-controller.js";
import { deleteComments, getRating, postRating } from "../controllers/RatingController.js";


const router = express.Router();
router.post("/post-rating", authenticateToken, postRating);
router.get("/get-rating/:id", authenticateToken, getRating);
router.delete("/delete-rating/:id", authenticateToken, deleteComments)

export default router;
