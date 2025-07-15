import { Server } from "socket.io"
import messageModel from "./Models/messageModel.js";
import channelModel from "./Models/channelModel.js";

const socketSetup = (server)=>{
    const io = new Server(server,{
        cors:{
            origin:[process.env.origin,"https://chatput-frontend.onrender.com"],
            credentials:true
        }
    });

    const userSocketMap = new Map();

    const disconnectSocket = (socket)=>{
        console.log("Client disconnected",socket.id);
        for(const [userId,socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId);
                break;
            }
        }
    }
    io.on("connection",(socket)=>{
        const {userId} = socket.handshake.auth;

        if(userId){
            userSocketMap.set(userId,socket.id);
            console.log(`User Connected: ${userId} with SocketId:${socket.id}`)
        }else{
            console.log("UserId not provided during Connection")
        }

        socket.on("sendMessage",async (message)=>{
            const senderSocketId = userSocketMap.get(message.sender);
            const receiverSocketId = userSocketMap.get(message.receiver);

            const createdMessage = await messageModel.create(message);

            const messageData = await messageModel.findById(createdMessage._id)
            .populate("sender","_id email firstName lastName profilePic color")
            .populate("receiver","_id email firstName lastName profilePic color")

            if(receiverSocketId){
                io.to(receiverSocketId).emit("receiveMessage",messageData)
            }
            if(senderSocketId){
                io.to(senderSocketId).emit("receiveMessage",messageData)
            } 
        })

        socket.on("send-channel-message",async(message)=>{
            const {name,channelId,sender,content,messageType,fileUrl} = message;
            console.log("group chat message",message)
            const createdMessage = await messageModel.create({
                sender,
                receiver:null,
                content,
                messageType,
                timeStamps:new Date(),
                fileUrl,
            })

            const messageData = await messageModel.findById(createdMessage._id)
            .populate("sender","id email firstName lastName image color")
            .exec()

            await channelModel.findByIdAndUpdate(channelId,{
                $push: {messages : createdMessage._id}
            })

            const channel = await channelModel.findById(channelId).populate("members");

            const finalData = {...messageData._doc,channelId:channel._id,name:channel.name}
            if(channel && channel.members){
                channel.members.forEach((member)=>{
                    const memberSocketId = userSocketMap.get(member._id.toString())
                    if(memberSocketId){
                        io.to(memberSocketId).emit("receive-channel-message",finalData)
                    }
                })
                const adminSocketId = userSocketMap.get(channel.admin._id.toString())
                if(adminSocketId){
                    io.to(adminSocketId).emit("receive-channel-message",finalData)
                }
            }
        })



        socket.on("disconnect",()=>disconnectSocket(socket))



    })
}

export default socketSetup