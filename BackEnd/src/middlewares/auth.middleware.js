import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req,res,next)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ","");
        if(!token){
            throw new ApiError(404,"accessToken Not Found");
        }

        const accessToken_Secret = "abxhaiiisjanan1987";
        const decodededToken = jwt.verify(token,accessToken_Secret);

        const user = await User.findById(decodededToken?._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(404,"User Not Found");
        }

        req.user = user;
        next();
    }
    catch(err){
        throw new ApiError(401,error?.message || "Invalid Token");
    }
});

export {verifyJWT};