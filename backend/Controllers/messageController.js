import messageModel from "../Models/messageModel.js";

const getMessages = async(req,res)=>{
    try {
        const user1 = req.id;
        const user2 = req.body.user2;
        if(!user1 || !user2){
            res.status(400).json({message:"Both users are required"});
            return;
        }
        const messages = await messageModel.find({
            $or:[{sender:user1,receiver:user2},{sender:user2,receiver:user1}]
        }).sort({timeStamps:1}).populate("sender","_id email firstName lastName").populate("receiver","_id email firstName lastName")

        return res.status(200).json({messages})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

const imageUpload= (req,res)=>{
    try {
        const imageUrl = req.file?.path;
        if(!imageUrl){
            return res.status(400).json({message:"No image uploaded"});
        }
        res.status(200).json({message:"Image uploaded successfuly",imageUrl});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

export {getMessages,imageUpload}