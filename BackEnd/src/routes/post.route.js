import { Router } from "express";
import { getallpost, uploadPost } from "../controllers/Post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/getallpost").get(getallpost);

router.route("/uploadpost").post(verifyJWT,upload.fields([{name:"file",maxCount : 1}]),uploadPost)

export default router;