
import { create} from "zustand";

const useUserStore = create((set,get)=>({
    authUser:null,
    setAuthUser : (user)=>set({authUser:user}),
    chatType:null,  //single person or group chat
    selectedUser:null, //user selected for chatting
    setSelectedUser : (user)=>set({selectedUser:user}),
    setChatType:(type)=>set({chatType:type}),
    closeChat:()=>set({chatType:null,selectedUser:null,chatMessages:[]}),
    //messages
    chatMessages:[],
    setChatMessages:(messages)=>set({chatMessages:messages}),
    addMessage:(message)=>{
        const chatMessages=get().chatMessages;
        const chatType = get().chatType;

        set({chatMessages:[...chatMessages,{
            ...message,
            receiver:chatType === "channel" ? message.receiver : message.receiver._id,
            sender:chatType === "channel" ? message.sender : message.sender._id,

        }]})
    },
    //users for DM
    

}))
export default useUserStore;