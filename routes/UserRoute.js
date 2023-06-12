import express from "express";
import { userProfileImage } from "../controllers/UserImageController.js";
import { UserEmailVerification, userLogin, userRegister } from "../controllers/UserController.js";
// import { authenticateToken } from "../controllers/jwt-controller.js";


const router = express.Router();


router.post(
    "/user-register",
    userProfileImage.single("profilePic"),
    userRegister
);
router.get(
    "/verify-user",
    UserEmailVerification
);
router.post("/user-login", userLogin);

export default router;