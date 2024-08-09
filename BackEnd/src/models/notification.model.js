import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const NotificationSchema = new Schema({
    text:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    isSeen:{
        type:Boolean,
        default : false,
    },
});

NotificationSchema.plugin(mongooseAggregatePaginate);

export const Notification = mongoose.model("Notification",NotificationSchema);