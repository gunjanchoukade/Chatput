import userModel from "../Models/userModel.js";
import {hashPassword,generateToken} from "../Utils/utils.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const signUp = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password) {
            res.status(400).json({message:"All fields are required"});
            return;
        }
        const found = await userModel.find({email});
        if(found._id){
            res.status(400).json({message:"User already exist."});
            return;
        }
        const hashedPassword = await hashPassword(password);
        const user = await userModel.create({email,password:hashedPassword});
        const token = await generateToken(user._id,email);
        res.cookie("token",token,{
            secure:true,
            sameSite:"none",
            maxAge:3 * 24 * 60 * 60 * 1000 // 3 days
        });

        return res.status(200).json({user:{
            id:user._id,
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
            profilePic:user.profilePic,
            profileSetup:user.profileSetup,
        }})

    } catch (error) {
        if(error.code === 11000) {
            return res.status(400).json({message:"User already exists with this email."});
        }
        res.status(500).json({message:"Internal server error"});
    }
}

const login=async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            res.status(400).json({message:"All fields are required"});
            return; 
        }
        const user = await userModel.findOne({email});
        if(!user){
            res.status(400).json({message:"You may SignUp first"});
            return;
        }
        const compare = await bcrypt.compare(password, user.password);
        if(!compare){
            res.status(400).json({message:"Invalid credentials"});
            return;
        }
        const token = await generateToken(user._id, email);
        res.cookie('token', token, {
            maxAge: 3 * 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "none"
        });
        return res.status(200).json({user:{
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePic: user.profilePic,
            profileSetup: user.profileSetup,
            color: user.color,
        }})

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

const getAuthUser = async (req,res)=>{
    try {
        const id = req.id;
        
        const user = await userModel.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });  
    }
}

const updateProfile=async(req,res)=>{
    try{
        const {firstName,lastName,color}=req.body;
        if(!firstName || !lastName || color<0){
            return res.status(400).json({message:"All fields are required(firstname,lastname,color)"});
        }
        const id = req.id;
        const user = await userModel.findByIdAndUpdate(id,{
            firstName,lastName,color,profileSetup:true
        },{new:true});
        return res.status(200).json({user:{
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePic: user.profilePic,
            profileSetup: user.profileSetup,
            color: user.color,
        }})

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
const profileChanger = async(req,res)=>{
    try {
        const id = req.id;
        const imageUrl = req.file?.path;
        if (!imageUrl) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const user = await userModel.findByIdAndUpdate(id,{
            profilePic:imageUrl
        },{new:true})
        res.status(200).json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
}
const removeProfile = async(req,res)=>{
    try {
        const id = req.id;
        const user = await userModel.findByIdAndUpdate(id,{
            profilePic:"",
        },{new:true})
        res.status(200).json({message:"Profile pic removed Successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
}

const logoutUser = async(req,res)=>{
    try {
        res.clearCookie("token",{
            secure:true,
            sameSite:"none"
        })
        return res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}
export {signUp,login,getAuthUser,updateProfile,profileChanger,removeProfile,logoutUser}