import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:false
    },
    messageType:{
        type:String,
        enum:["text","file"],
        required:true,
    },
    content:{
        type:String,
        required:function(){
            return this.messageType==='text'
        }
    },
    fileUrl:{
        type:String,
        required:function(){
            return this.messageType==='file'
        }
    },
    timeStamps:{
        type:Date,
        default:Date.now
    },
  
})

const messageModel = mongoose.model("message",messageSchema);
export default messageModel