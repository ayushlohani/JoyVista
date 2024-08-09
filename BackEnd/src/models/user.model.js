import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import mongooseaggregatepaginate from "mongoose-aggregate-paginate-v2"
import jwt from "jwt";

const UserSchema = new Schema({
    name:{
        type:String,
        required:true,
        index:true,
        trim:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        index:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    dob:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    phoneno:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    profilepic:{
        type:String,
    },
    following:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    followers:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    posts:[{
        type:Schema.Types.ObjectId,
        ref:"Post"
    }],
    savedpost:[{
        type:Schema.Types.ObjectId,
        ref:"Post"
        
    }],
    bio:{
        type:String,
        required:true,
        trim:true
    },
    refreshToken:{
        type:String,
    }
},{timestamps:true});

UserSchema.plugin(mongooseaggregatepaginate);

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);
    next();
});

UserSchema.methods.isPasswordCorrect =async (password)=>{
    return await bcrypt.compare(password,this.password);
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        username: this.username,
        email:this.email,
        name: this.name
    },
    'abxhaiiisjanan1987',
    {
        expiresIn : "10d"
    })
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,
    },
    "refrsh@tion58#191",
    {
        expiresIn: "30d"
    });
}

export const User = mongoose.model("User",UserSchema);