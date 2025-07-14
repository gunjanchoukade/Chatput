import mongoose from "mongoose";
import userModel from "../Models/userModel.js";
import messageModel from "../Models/messageModel.js";

const getSearchedUser = async (req,res)=>{
    try {
        const id = req.id;
        const {searchedUser} = req.body;
        if(searchedUser == undefined || searchedUser === null){
            return res.status(400).json({message:"search term is required"});
        }
        const sanitizedSearchedUser = searchedUser.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        )
        const regex = new RegExp(sanitizedSearchedUser,"i");
        const contacts = await userModel.find({
            $and:[
                { _id : { $ne:id } },
                { 
                    $or:[{firstName:regex},{lastName:regex},{email:regex}]
                },
            ],
        });
        return res.status(200).json({contacts})
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}
const getAllUsers = async (req,res)=>{
    try {
        const id = req.id;
        const allUsers = await userModel.find({_id:{$ne:id}});
        res.status(200).json({allUsers})
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}

const getUsersForDm = async(req,res)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req.id);
        const contacts = await messageModel.aggregate([
            {
                $match:{
                    $or:[{sender:userId},{receiver:userId}],
                },
            },
            {
                $sort:{timeStamps:-1},
            },
            {
                $group:{
                    _id:{
                        $cond:{
                            if:{$eq:["$sender",userId]},
                            then:"$receiver",
                            else:"$sender"
                        }
                    },
                    lastMessageTime:{$first:"$timeStamps"}
                },
            }, 
            {
                $lookup:{
                    from:"users",
                    localField:"_id",
                    foreignField:"_id",
                    as:"contactInfo",
                }
            },{
                $unwind:"$contactInfo",
            },{
                $project:{
                    _id:1,
                    lastMessageTime:1,
                    email:"$contactInfo.email",
                    firstName:"$contactInfo.firstName",
                    lastName:"$contactInfo.lastName",
                    profilePic:"$contactInfo.profilePic",
                    color:"$contactInfo.color",
                }
            },{
                $sort:{lastMessageTime:-1},
            }
        ]);
        return res.status(200).json({contacts})
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}

const usersForChannel = async(req,res)=>{
    try {
        const users = await userModel.find({_id:{$ne:req.id}},"firstName lastName email _id");
        const contacts = users.map((user)=>({
            label:user.firstName ? `${user.firstName+" "+user.lastName}` : user.email,
            value:user._id
        }))

        return res.status(200).json({message:"contacts for channel:-",contacts});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}

export {getSearchedUser,getAllUsers,getUsersForDm,usersForChannel}