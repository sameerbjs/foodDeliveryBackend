import express from "express";
import { authenticateToken } from "../controllers/jwt-controller.js";
import { addCategory, getCategory,deleteCategory } from "../controllers/CategoryController.js"

const router = express.Router();

router.post('/add-category', authenticateToken, addCategory);
router.get('/get-category/:id', authenticateToken, getCategory);
router.delete('/delete-category/:id', authenticateToken, deleteCategory);

export default router;
