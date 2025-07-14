import React, { useContext, useState } from 'react'
import { SendHorizonal ,LinkIcon,Sticker, ChartColumnStacked} from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import useUserStore from '../../../store/userStore';
import { socketDataContext } from '../../context/SocketContext';
import axios from 'axios';
const ContainerFooter = () => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [message,setMessage] = useState("")
  const {selectedUser,authUser,chatType} = useUserStore();
  const backendURL = import.meta.env.VITE_backendURL


  const toggleEmoji = () => {
    if (!showEmoji) {
        setIsMounted(true);            // mount first
        setTimeout(() => setShowEmoji(true),0); // small delay to trigger transition
    } else {
        setShowEmoji(false);           // hide instantly
        setIsMounted(false);           // unmount instantly after hide
    }
  };

  const addEmojiToMessage=(emojiData)=>{
    setMessage((prev)=>prev+emojiData.emoji);
  }

  
  const socket = useContext(socketDataContext)
  const handleSendMessage = ()=>{
    if(chatType === 'contact'){
      socket.emit("sendMessage",{
        sender:authUser._id,
        receiver:selectedUser._id,
        content:message,
        messageType:'text',
        fileUrl:undefined
      })
    }else if(chatType === 'channel'){
      socket.emit("send-channel-message",{
        name:selectedUser.name,
        sender:authUser._id,
        content:message,
        messageType:'text',
        fileUrl:undefined,
        channelId:selectedUser._id
      })
    }
  }
  
  const handleImageSelect = async (event)=>{
    try {
      const file = event.target.files[0];
      if(!file){
        alert("Please select a file first!")
      }
      const formData = new FormData();
      formData.append("image",file)
      const response = await axios.post(`${backendURL}/messages/upload-image`,formData,{withCredentials:true});
      if(response.status==200){

        if(chatType === 'contact')
        {
          socket.emit("sendMessage",{
          sender:authUser._id,
          receiver:selectedUser._id,
          content:undefined,
          messageType:"file",
          fileUrl:response.data.imageUrl
          })
        }

        if(chatType === 'channel'){
          socket.emit("send-channel-message",{
            sender:authUser._id,
            content:undefined,
            messageType:'file',
            fileUrl:response.data.imageUrl,
            channelId:selectedUser._id,
          })
        }
        setMessage("")
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
    

  return (
    <div className='absolute bottom-0 h-[10vh] flex items-center w-full px-4'>
      <div className={`absolute top-[-400px] h-[30vh] transition-all duration-300 ${
            showEmoji ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
        <EmojiPicker  onEmojiClick={(emojiData)=>addEmojiToMessage(emojiData)}
        open={showEmoji} theme='dark' height={400} width={350} searchDisabled={true}  />
      </div>
      <div className='w-full flex '>
        <div className='flex'>
            <input onChange={(e)=>setMessage(e.target.value)} value={message}
            className='md:w-[63vw] w-[78vw] bg-[#303036] text-white border-none outline-none p-4 rounded-md pr-23'
            type="text" placeholder='Type your message....' />
            <span 
            onClick={toggleEmoji}
            className='text-white absolute right-30 bottom-8 lg:right-40 lg:bottom-6'><Sticker/>
            </span>
            <label htmlFor="imageSelect">
              <span className="text-yellow-300 absolute right-20 bottom-8 lg:right-30 lg:bottom-6"><LinkIcon/></span>
            </label>
            <input type="file" id='imageSelect' onChange={handleImageSelect} className='hidden' />
        </div>
        <button onClick={handleSendMessage} 
        className='bg-[#505269] text-white px-4 py-2 rounded-md ml-2'> <SendHorizonal /></button>
       
      </div>
    </div>
  )
}

export default ContainerFooter
