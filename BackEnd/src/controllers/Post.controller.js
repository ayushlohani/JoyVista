import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";

const getallpost = asyncHandler(async (req,res)=>{
    const {page = 1,limit = 10,sortBY = 'createdAt',sortType = 'desc'} = req.query;

    const pageNo = parseInt(page,10);
    const pageSize = parseInt(page,10);
    const sort ={
        sortBY : sortType === 'asc' ? 1 : -1
    }

    const skip = (pageNo-1)*pageSize;

    const posts = await Post.find({}).sort(sort).skip(skip).limit(pageSize).select("-password -refreshToken");

    if(!posts){
        throw new ApiError(404,"Posts Not Found");
    }

    const total = await Post.countDocuments();

    return res.status(200).json(new ApiResponse(200,{posts,page : pageNo,limit,Total : total},"Posts fetched succesfully"));

});

const uploadPost = asyncHandler(async (req,res)=>{
    const {title,category,caption} = req.body;

    if(!title && !category && !caption){
        throw new ApiError(402,"Basic Fields Required");
    }

    const localfilepath = req.files?.file[0].path;

    if(!localfilepath){
        throw new ApiError(404,"Loacal file path not found");
    }

    const cloudinaryResult = await uploadonCloudinary(localfilepath);
    
    const post = await Post.create({
        title,
        caption,
        category,
        file : cloudinaryResult.url,
        owner : req.user?._id
    })

    if(!post){
        throw new ApiError(401,"Upload a Post failed!");
    }

    const user = await User.findById(req.user?._id);

    user.posts.push(post?._id);
    await user.save({validateBeforeSave:false});

    return res.status(200).json(new ApiResponse(200,post,"Post Uploaded Successfully"));
})


export {getallpost,uploadPost}