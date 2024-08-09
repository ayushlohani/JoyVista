import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const PostSchema = new Schema({
    title:{
        type:String,
        required:true,
        Trim:true
    },
    file:{
        type:String,
        required:true
    },
    sound:{
        type:Boolean,
        default:false
    },
    category:{
        type:String,
        required:true,
        Trim:true
    },
    caption:{
        type:String,
        required:true,
        Trim:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    taggedUser:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    likes:{
        type:Number,
        required:true,
        default:0
    },
    comments:[{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    }],
    shares:{
        type:Number,
        default:0
    },
    isSaved:{
        type:Boolean,
        default:false
    }
});

PostSchema.plugin(mongooseAggregatePaginate);

export const Post = mongoose.model("Post",PostSchema);