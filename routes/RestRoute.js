import express from "express";
import {
    resturantLogin,
    resturantRegister,
    resturantEmailVerification,
    getresturantDetail,
    resturantEdit,
    getResturantsByCity
} from "../controllers/ResturantController.js";
import { authenticateToken } from "../controllers/jwt-controller.js";


const router = express.Router();

router.post(
    "/rest-register",
    resturantRegister
);
router.get(
    "/verify",
    resturantEmailVerification
);
router.post("/rest-login", resturantLogin);

router.get("/get-resturant/:id", authenticateToken, getresturantDetail);

router.post("/rest-edit/:id", authenticateToken, resturantEdit);

router.get("/get-rest-city/:city", getResturantsByCity);

export default router;
