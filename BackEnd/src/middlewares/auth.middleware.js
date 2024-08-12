import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || (req.header("Authorization")?.replace("Bearer ", "") || "");
        
        if (!token) {
            throw new ApiError(401, "Access Token Not Found");
        }

        const accessTokenSecret = "abxhaiiisjanan1987";

        // Verify token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, accessTokenSecret);
        } catch (err) {
            throw new ApiError(401, "Invalid Token");
        }

        // Find the user associated with the token
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(404, "User Not Found");
        }

        req.user = user;
        next();
    } catch (error) {
        next(error); 
    }
});

export { verifyJWT };
