import express from "express";
import { userProfileImage } from "../controllers/UserImageController.js";
import { UserEmailVerification, getUserDetail, userEdit, userLogin, userRegister } from "../controllers/UserController.js";
import { authenticateToken } from "../controllers/jwt-controller.js";


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

router.get("/get-user/:id", authenticateToken, getUserDetail);

router.post("/user-edit/:id", authenticateToken,userProfileImage.single("profilePic"), userEdit);


export default router;