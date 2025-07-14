import mongoose from "mongoose";
import channelModel from "../Models/channelModel.js";
import userModel from "../Models/userModel.js";

const createChannel = async (req,res)=>{
    try{
        const {name,members} = req.body;
        const userId = req.id;

        const admin = await userModel.findById(userId);

        if(!admin){
            return res.status(400).send("Admin not found");
        }

        //find the members from database
        const validateMembers = await userModel.find({_id:{$in:members}})
        if(validateMembers.length !== members.length)
        {
            return res.status(400).send("Some members are not valid");
        }

        const newChannel = new channelModel({
            name,
            members,
            admin:userId,
        });

        await newChannel.save();
        return res.status(200).json({message:"Channel created successfully",channel:newChannel})
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Server error"});
    }
}
const getChannelsForSidebar = async(req,res)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req.id);
        const channels = await channelModel.find({$or:[{admin:userId},{members:userId}]}).sort({updatedAt:-1})
        res.status(200).json({message:"Channels for display",channels})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server error"});
    }
}

const getChannelMessages = async (req,res)=>{
    try {
        const channelId = req.params.channelId;
        const channel = await channelModel.findById(channelId).populate({
            path:"messages",
            populate:{
                path:"sender",
                select:"firstName lastName email color  profilePic _id"
            },
            
        })

        if(!channel){
            return res.status(404).json({message:"Channel not found"});
        }
        const messages = channel.messages;
        res.status(200).json({messages,name:channel.name})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server error"});
    }
}
export {createChannel,getChannelsForSidebar,getChannelMessages}