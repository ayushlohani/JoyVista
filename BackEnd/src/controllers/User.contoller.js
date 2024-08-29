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

const getalluser = asyncHandler(async (req,res)=>{
    try {
        const {page = 1,limit = 20,sortType = "desc",sortBy = "createdAt"} = req.query;
    
        const pageNumber = parseInt(page,10);
        const pageSize = parseInt(limit,10);
        const sortDirection = sortType === "asc" ? 1 : -1;
        const sort = {};
        sort[sortBy] = sortDirection;
        const skip = (pageNumber - 1)*pageSize;
    
        const user = await User.find({}).sort(sort).skip(skip).limit(pageSize).select("-password -refreshToken");
    
        if(!user){
            throw new ApiError(404,"User not Found");
        }
    
        const total = await User.countDocuments({});
    
        return res.status(200).json(new ApiResponse(200,{user,total,page:pageNumber,limit:pageSize},"Users fetched successfully"));
    } catch (error) {
        throw new ApiError(403,"Getting all Users failed");
    }
})

const getUserbyId = asyncHandler(async (req,res)=>{
    const {id} = req.params;

    if(!id){
        throw new ApiError(404,"Id not Found");
    }

    const user = await User.findById(id).select("-password -refreshToken");

    if(!user){
        throw new ApiError(404,"User does not exist");
    }

    return res.status(200).json(new ApiResponse(200,user,"User Fetched Successfully"));


})

const searchuser = asyncHandler(async (req,res)=>{
    try {
        const {search = '',page = 1,limit = 10,sortType = "desc",sortBy = "createdAt"} = req.query;
    
        const pageNumber = parseInt(page,10);
        const pageSize = parseInt(limit,10);
        const sortDirection = sortType === "asc" ? 1 : -1;
        const sort = {};
        sort[sortBy] = sortDirection;
        const skip = (pageNumber - 1)*pageSize;
    
        const searchQuery = search ? {
            $or:[
                {name:{$regex:search,$options:'i'}},
                {email:{$regex:search,$options:'i'}},
                {username:{$regex:search,$options:'i'}}
            ]
        } : {};
    
        const user = await User.find(searchQuery).sort(sort).skip(skip).limit(pageSize).select("-password -refreshToken");
    
        if(!user){
            throw new ApiError(404,"User not Found");
        }
    
        const total = await User.countDocuments(searchQuery);
    
        return res.status(200).json(new ApiResponse(200,{user,total,page:pageNumber,limit:pageSize},"Users fetched successfully"));
    } catch (error) {
        throw new ApiError(401,"Searching User Failed");
    }
})

const RegisterUser = asyncHandler(async (req, res) => {
    const { name, email, password, bio, username, dob, phoneno } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password || !bio || !username || !dob || !phoneno) {
        throw new ApiError(400, "All Profile Info is required");
    }

    // Check if the user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(401, "User already exists");
    }

    // Handle profile picture upload
    let profilepicUrl = "https://w7.pngwing.com/pngs/708/467/png-transparent-avatar-default-head-person-unknown-user-anonym-user-pictures-icon.png";
    if (req.files && req.files.profilepic && req.files.profilepic.length > 0) {
        const profilepicLocalPath = req.files.profilepic[0].path;

        // Upload profile picture to Cloudinary
        try {
            const profilepic = await uploadonCloudinary(profilepicLocalPath);
            profilepicUrl = profilepic.url;
        } catch (error) {
            throw new ApiError(402, "Profile picture upload to Cloudinary failed");
        }
    }

    // Create the user
    const user = await User.create({
        name,
        username,
        email,
        password,
        bio,
        phoneno,
        dob,
        profilepic: profilepicUrl // This can be null if no profile picture was uploaded
    });

    if (!user) {
        throw new ApiError(401, "User creation failed");
    }

    // Fetch the created user, excluding sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // Respond with the created user
    res.status(200).json(new ApiResponse(200, createdUser, "User registered successfully!"));
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

const getLoggedinUser = asyncHandler(async (req,res)=>{
    const user = req.user;
    if(!user){
        throw new ApiError(404,"User Not Found");
    }

    return res.status(200).json(new ApiResponse(200,user,"User Fetched Successfully"));
})

const updateUser = asyncHandler(async (req,res)=>{
    const user = req.user;

    const {name,email,username,phone} = req.body;

    const userupdated = await User.findByIdAndUpdate(user?._id,{
        $set:{
            name,
            email,
            username,
            phone
        }
    },{new:true}).select("-password -refreshToken");

    if(!userupdated){
        throw new ApiError(404,"User Not Found");
    }

    return res.status(200).json(new ApiResponse(200,userupdated,"User Updated Successfully"));
    
})

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect =await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old Password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    const {accesstoken,refreshToken} = await generateAccessandRefreshToken(user._id);

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200).cookie("accessToken",accesstoken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200, {}, "Password Changed"));
});

const updateProfilepic = asyncHandler(async (req, res) => {
    const profilepic = req.file?.path;
    if (!profilepic) {
        throw new ApiError(401, "Profile Picture Required To Update");
    }

    // Await the Cloudinary upload function
    const cloudinaryResult = await uploadonCloudinary(profilepic);

    if (!cloudinaryResult || !cloudinaryResult.url) {
        throw new ApiError(402, "Cloudinary upload failed!!");
    }

    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $set: { profilepic: cloudinaryResult.url } },
        { new: true }
    ).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, updatedUser, "User Profile Pic updated successfully"));
});

const follow = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find the user to follow
    const usertofollow = await User.findById(id).select("-password -refreshToken");
    if (!usertofollow) {
        throw new ApiError(404, "User not Found");
    }

    // Check if the user is already a follower
    if (usertofollow.followers.includes(req.user._id)) {
        throw new ApiError(400, "You are already following this user");
    }

    // Update the followers list of the user to follow
    usertofollow.followers.push(req.user._id);
    await usertofollow.save();

    // Find the current user and update their following list
    const userfollowing = await User.findById(req.user._id).select("-password -refreshToken");
    if (!userfollowing) {
        throw new ApiError(404, "User not Found");
    }

    userfollowing.following.push(id);
    await userfollowing.save();

    return res.status(200).json(new ApiResponse(200, { usertofollow, userfollowing }, "Followed Successfully"));
});


export {RegisterUser,LoginUser,LogoutUser,refreshAccessToken,getLoggedinUser,getalluser,searchuser,updateUser,getUserbyId,updatePassword,updateProfilepic,follow};