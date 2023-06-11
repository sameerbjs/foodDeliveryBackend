import express from "express";
import {
    resturantLogin,
    resturantRegister,
    resturantEmailVerification,
    getresturantDetail,
    resturantEdit
} from "../controllers/ResturantController.js";
import { restProfileUpload } from "../controllers/ImageController.js";
import { authenticateToken } from "../controllers/jwt-controller.js";


const router = express.Router();

router.post(
    "/rest-register",
    restProfileUpload.single("profilePic"),
    resturantRegister
);
router.get(
    "/verify",
    resturantEmailVerification
);
router.post("/rest-login", resturantLogin);

router.get("/get-resturant/:id", authenticateToken, getresturantDetail);

router.post("/rest-edit/:id", authenticateToken,restProfileUpload.single("profilePic"), resturantEdit)

export default router;
