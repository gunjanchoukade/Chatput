import { useEffect, useRef, useState } from "react";
import useUserStore from "../../../store/userStore";
import axios from "axios";
import { getColor } from "../../lib/utils";

const ContainerBody = () => {
  const {
    chatMessages,
    authUser,
    selectedUser,
    chatType,
    setChatMessages,
  } = useUserStore();
  const [channelName,setChannelName] = useState("")
  const scrollRef = useRef(null);
  const backendURL = import.meta.env.VITE_backendURL;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUsersMessage = async () => {
    if (!selectedUser?._id) return;
    try {
      const response = await axios.post(
        `${backendURL}/messages/getMessages`,
        { user2: selectedUser._id },
        { withCredentials: true }
      );

      const newMessages = response.data?.messages || [];
      if (JSON.stringify(newMessages) !== JSON.stringify(chatMessages)) {
        setChatMessages(newMessages);
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    }
  };

  const getChannelMessages = async ()=>{
    try {
      console.log("Channel called")
      const response = await axios.get(`${backendURL}/channels/get-channel-messages/${selectedUser._id}`,{withCredentials:true});
      const newMessages = response.data?.messages;
      console.log("response",response)
      if (JSON.stringify(newMessages) !== JSON.stringify(chatMessages)) {
        setChatMessages(newMessages);
        setChannelName(response.data.name)
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    }
  }

  // fetch messages on user change
  useEffect(() => {
    if (selectedUser && chatType === "contact") {
      getUsersMessage();
    }
    if(selectedUser && chatType === 'channel'){
      getChannelMessages()
    }
  }, [selectedUser]);

  // scroll to last message
  useEffect(() => {
    requestAnimationFrame(() => {
      console.log(selectedUser)
      scrollRef.current?.scrollIntoView({ behavior: "auto" });
    });
  }, [chatMessages]);

  return (
    <div className="px-4 overflow-y-auto  h-[80vh] py-2 bg-[#1a1a1a]">
      {chatType === 'contact' ? 

      <div className="flex flex-col gap-3">
        {chatMessages.map((message, index) => {
          const isSender =
            message?.sender?._id === authUser._id ||
            message?.sender === authUser._id;

          const isSelectedUserMessage =
            (message?.sender?._id === selectedUser?._id ||
              message?.receiver?._id === selectedUser?._id ||
              message?.sender === selectedUser?._id ||
              message?.receiver === selectedUser?._id) 
            

          if (!isSelectedUserMessage)
          return null;
          return (
            <div
              key={index}
              className={`flex flex-col gap-1 ${
                isSender ? "items-end" : "items-start"
              }`}
            >
              {message.messageType=='text' &&
                <p
                  className={`px-3 py-2 rounded-lg max-w-[70%] ${
                    isSender
                      ? "rounded-br-none bg-blue-700 shadow-lg"
                      : "rounded-bl-none bg-gray-800 shadow-md"
                  }`}
                >
                  {message.content}
                </p>
              }
              {message.messageType=='file' && 
                <div className={`w-[70vw] md:w-[20vw] rounded-lg ${isSender ? "rounded-br-none" :"rounded-bl-none"} p-2 border-2 border-gray-700`}>
                  <a href={message.fileUrl} download target="_blank" rel="noopener noreferrer">
                    <img src={message.fileUrl} className={`rounded-lg ${isSender ? "rounded-br-none" : "rounded-bl-none"}`} /> 
                  </a>
                </div>
              }
              <p className="text-[10px] text-gray-400">
                {formatTime(message.timeStamps)}
              </p>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>
      :
      <div className="flex flex-col gap-5">
        {
          chatMessages.map((message,index)=>{
            const isSender = message.sender._id === authUser._id
            const isCorrect = message.name === selectedUser?.name;
            if(!isCorrect && selectedUser?.name === channelName){
              return "hello";
            }
            return(
              <div key={index}
                className={`flex flex-col gap-1 ${
                isSender ? "items-end" : "items-start"
              }`}>
                {message.messageType==='text' && <div className="max-w-[80%] flex flex-col-reverse tems-start gap-2">
                  { message.sender._id  !== authUser._id && 
                    <div>
                      {message.sender.profilePic  ? 
                      <div className='flex'>
                          <div className={`w-4 h-4 rounded-full ${getColor(authUser.color)} flex justify-center items-center text-2xl rounded-full `}>
                              <img src={message.sender.profilePic}  /> 
                          </div>
                          
                      </div>
                      :
                      <div className=' flex gap-2 items-center justify-between '>
                          <div className='flex gap-1 items-center'>
                            <div className={`w-4 h-4 uppercase rounded-full ${getColor(message.sender.color)} flex justify-center items-center text-md  rounded-full `}>
                              <p>{message.sender?.email?.split("").shift()}</p>   
                            </div>   
                            <p className="text-gray-400">{message.sender.firstName ? message.sender.firstName : message.sender.email}</p>  
                          </div> 
                      </div>}
                    </div> 
                  }  
                  <p className={`px-3 py-2 rounded-lg break-words ${
                    isSender
                      ? "rounded-br-none bg-blue-700 shadow-lg"
                      : "rounded-bl-none bg-gray-800 shadow-md"
                  }`}>{message.content}</p>
                </div>
                }
                {message.messageType==='file' &&
                  <div className={`w-[70vw] md:w-[20vw] rounded-lg ${isSender ? "rounded-br-none" :"rounded-bl-none"} p-2 border-2 border-gray-700`}>
                    <a href={message.fileUrl} download target="_blank" rel="noopener noreferrer">
                      <img src={message.fileUrl} className={`rounded-lg ${isSender ? "rounded-br-none" : "rounded-bl-none"}`} /> 
                    </a>
                  </div>
                }
                <p className="text-[10px] text-gray-400">
                  {formatTime(message.timeStamps)}
                </p>
              </div>
            )
          })
        }
        <div ref={scrollRef} />
      </div>
      }
    </div>
  );
};

export default ContainerBody;

{/* <div className="px-4 overflow-y-auto  h-[80vh] py-2 bg-[#1a1a1a]">
      <div className="flex flex-col gap-3">
        {chatMessages.map((message, index) => {
          const isSender =
            message?.sender?._id === authUser._id ||
            message?.sender === authUser._id;

          const isSelectedUserMessage =
            (message?.sender?._id === selectedUser?._id ||
              message?.receiver?._id === selectedUser?._id ||
              message?.sender === selectedUser?._id ||
              message?.receiver === selectedUser?._id) &&
            chatType === "contact";

          if (!isSelectedUserMessage)
            return null;

          return (
            <div
              key={index}
              className={`flex flex-col gap-1 ${
                isSender ? "items-end" : "items-start"
              }`}
            >
              {message.messageType=='text' &&
                <p
                  className={`px-3 py-2 rounded-lg max-w-[70%] ${
                    isSender
                      ? "rounded-br-none bg-blue-700 shadow-lg"
                      : "rounded-bl-none bg-gray-800 shadow-md"
                  }`}
                >
                  {message.content}
                </p>
              }
              {message.messageType=='file' && 
                <div className={`w-[70vw] md:w-[20vw] rounded-lg ${isSender ? "rounded-br-none" :"rounded-bl-none"} p-2 border-2 border-gray-700`}>
                  <a href={message.fileUrl} download target="_blank" rel="noopener noreferrer">
                    <img src={message.fileUrl} className={`rounded-lg ${isSender ? "rounded-br-none" : "rounded-bl-none"}`} /> 
                  </a>
                </div>
              }
              <p className="text-[10px] text-gray-400">
                {formatTime(message.timeStamps)}
              </p>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>
    </div> */}