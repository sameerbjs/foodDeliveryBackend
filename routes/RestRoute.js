import express from "express";
import {
    resturantLogin,
    resturantRegister,
} from "../controllers/ResturantController.js";
import {restProfileUpload} from "../controllers/ImageController.js";

const router = express.Router();

router.post(
    "/rest-register",
    restProfileUpload.single("profilePic"),
    resturantRegister
);
router.post("/rest-login", resturantLogin);

export default router;
