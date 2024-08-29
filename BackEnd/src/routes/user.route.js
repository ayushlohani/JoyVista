import { Router } from "express";
import { follow, getalluser, getLoggedinUser, getUserbyId, LoginUser, LogoutUser, refreshAccessToken, RegisterUser, searchuser, updatePassword, updateProfilepic, updateUser } from "../controllers/User.contoller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(upload.fields([{name:"profilepic",maxCount : 1}]),RegisterUser);
router.route("/login").post(LoginUser);
router.route("/logout").post(verifyJWT,LogoutUser);
router.route("/refresh-accessToken").post(refreshAccessToken);


router.route("/loggedin-user").get(verifyJWT,getLoggedinUser);
router.route("/getallUsers").get(getalluser);
router.route("/searchuser").get(searchuser);
router.route("/getUser/:id").get(getUserbyId);

router.route("/updateUser").patch(verifyJWT,updateUser);
router.route("/updatePassword").patch(verifyJWT,updatePassword);
router.route("/updateProfilePic").patch(verifyJWT,upload.single("profilepic"),updateProfilepic);
router.route("/follow/:id").patch(verifyJWT,follow);

export default router;