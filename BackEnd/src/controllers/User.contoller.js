import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import {uploadonCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const generateAccessandRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accesstoken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave:false});
    
        return {accesstoken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating Access and Refresh Token");
    }
}

const RegisterUser = asyncHandler(async (req,res)=>{
    const {name,email,password,bio,username,dob,phoneno} = req.body;
    if(!name && !email && !password && !bio && !profilepic && username && !dob && !phoneno){
        throw new ApiError(400,"All Profile Info is required");
    }

    const existedUser =await User.findOne({
        $or:[{username},{email}]
    });

    if(existedUser){
        throw new ApiError(401,"User already Existed");
    }

    const profilepicLocalPath = req.files?.profilepic[0]?.path;

    if(!profilepicLocalPath){
        throw new ApiError(402,"File can't be Located");
    }

    const profilepic = await uploadonCloudinary(profilepicLocalPath);

    if(!profilepic){
        throw new ApiError(401,"Profile Upload in cloudinary is failed");
    }

    const user =await User.create({
        name,
        username,
        email,
        password,
        bio,
        phoneno,
        dob,
        profilepic:profilepic.url
    })

    if(!user){
        throw await ApiError(401,"User Creation Failed!!")
    }

    const createduser = await User.findById(user._id).select("-password -refreshToken");

    res.status(200).json(new ApiResponse(200,createduser,"User Registered Successfully!"));

});

const LoginUser = asyncHandler(async (req,res)=>{

    const {username,email,password} = req.body;

    if(!username && !email){
        throw new ApiError(403,"Username or Email required");
    }

    const user = await User.findOne({
        $or : [{username},{email}]
    });

    if(!user){
        throw new ApiError(404,"Wrong Username or Email");
    }

    const isPasswordValid =await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(402,"Password is Invalid");
    }

    const {accesstoken,refreshToken} =await generateAccessandRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure : true
    }

    res.status(200).cookie("accessToken",accesstoken,options).cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{
        user:loggedInUser,
        accesstoken,
        refreshToken
    },"User LoggedIn SuccessFully"));
})

const LogoutUser = asyncHandler(async (req,res)=>{
    const user = req.user;
    await User.findByIdAndUpdate(user?._id,{
        $set : {refreshToken : undefined}
    },{new:true});

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",options)
    .clearCookie("refreshToken",options).json(new ApiResponse(200,user,"Logout SuccessFully"));
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        if(!incomingRefreshToken){
            throw new ApiError(401,"unauthorized request refresh token");
        }
     
        const refreshToken_secret = "refrsh@tion58#191";
        const decodedToken = jwt.verify(incomingRefreshToken,refreshToken_secret);
        const user =await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(401,"Invalid refresh token");
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used");
        }
    
        const option = {
            httpOnly: true,
            secure: true
        }
    
        const {accesstoken,newrefreshToken} = await generateAccessandRefreshToken(user._id);
    
        return res.status(200)
        .cookie("accessToken",accesstoken,option)
        .cookie("refreshToken",newrefreshToken,option)
        .json(new ApiResponse(200,{accesstoken,newrefreshToken},"Access Token Refreshed"));
    } catch (error) {
        throw new ApiError(401,error?.message,"Invalid Tokens");
    }
})

export {RegisterUser,LoginUser,LogoutUser,refreshAccessToken};