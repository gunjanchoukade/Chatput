import React, { createContext, useEffect, useRef } from 'react'
import useUserStore from '../../store/userStore';
import {io} from "socket.io-client"
import { useState } from 'react';


export const socketDataContext  = createContext()

const SocketContext = ({children}) => {

    const socket = useRef();
    const {authUser} = useUserStore()
    const backendURL = import.meta.env.VITE_backendURL
    
    
    useEffect(()=>{
        console.log(authUser)
        if(authUser){
            socket.current = io(backendURL,{
                withCredentials:true,
                auth:{
                    userId:authUser._id
                }
            });

            socket.current.on("connect",()=>{
                console.log("connected to socket server");
            })
            
            socket.current.on("receiveMessage",(message)=>{
                const {selectedUser,chatType,addMessage} = useUserStore.getState()
                if(chatType!==undefined && (selectedUser._id === message.sender._id || selectedUser._id === message.receiver._id)){
                    console.log("message",message)
                    addMessage(message);
                }
            })

            socket.current.on("receive-channel-message",(message)=>{
                const {selectedUser,chatType,addMessage} = useUserStore.getState()
                if(chatType!=='undefined' && selectedUser._id === message.channelId){
                    console.log("message from socketcontext of group",message)
                    addMessage(message);
                }
            })

            return ()=>{
                socket.current.disconnect();
            }
        }
    },[authUser])
  return (
    <socketDataContext.Provider value={socket.current}>
        {children}
    </socketDataContext.Provider>
  )
}

export default SocketContext
