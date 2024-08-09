import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CommentSchema = new Schema({
    text:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    likes:{
        type:Number,
        required:true,
        default:0
    },
    comments:[{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    }]
});

CommentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment",CommentSchema);