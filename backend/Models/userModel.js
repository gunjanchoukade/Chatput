import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:false
    },
    lastName:{
        type:String,
        required:false
    },
    profilePic:{
        type:String,
        required:false,
    },
    color:{
        type:Number,
        required:false
    },
    profileSetup:{
        type:Boolean,
        default:false
    }
})

const userModel = mongoose.model("user",userSchema);
export default userModel;