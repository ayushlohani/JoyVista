import { Router } from "express";

const router = Router();
router.route("/").get((req,res)=>{
    res.send("Hello");
})

export default router;