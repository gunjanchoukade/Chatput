import React, { use, useEffect } from 'react'
import useUserStore from '../../../store/userStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../chat-components/Sidebar';
import EmptyChat from '../chat-components/EmptyChat';
import ChatContainer from '../chat-components/ChatContainer';

const Chat = () => {
  const {authUser} = useUserStore();
  const navigate = useNavigate()
  useEffect(()=>{
    if(!authUser.profileSetup){
      toast.error("Please setup your profile first to continue!.")
      navigate('/profile');
    }
  },[authUser])
   
  return (
    <div className=' h-[100vh] w-[100vw] flex overflow-hidden '>
      <Sidebar/>
      <EmptyChat/>
      <ChatContainer/>
    </div>
  )
}

export default Chat
