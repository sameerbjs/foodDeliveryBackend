import express from "express";
import { handleContactUs } from "../controllers/ContactController.js";

const router = express.Router();

router.post("/contact-us", handleContactUs);

export default router;