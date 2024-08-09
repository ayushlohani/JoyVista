import { Router } from "express";
import { LoginUser, LogoutUser, refreshAccessToken, RegisterUser } from "../controllers/User.contoller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(upload.fields([{name:"profilepic",maxCount : 1}]),RegisterUser);
router.route("/login").post(LoginUser);
router.route("/logout").post(verifyJWT,LogoutUser);
router.route("/refresh-accessToken").post(refreshAccessToken);

export default router;