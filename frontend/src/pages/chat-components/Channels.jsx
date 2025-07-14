import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import {Tooltip,TooltipContent,TooltipTrigger,} from "@/components/ui/tooltip"
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios";
import { getColor } from "../../lib/utils";
import useUserStore from "../../../store/userStore";
import MultipleSelector from "../../components/ui/multipleselect";
import { useContext } from "react";
import { storeDataContext } from "../../context/StoreContext";
import { toast } from "sonner";


const Channel = () => {
    const [openChannelDialog,setOpenChannelDialog] = useState(false);
    const [channelName,setChannelName] = useState("")
    const backendURL = import.meta.env.VITE_backendURL
    const [allContacts,setAllContacts]  = useState([]);
    const [selectedContacts,setSelectedContacts] = useState([])
    const {channels,setChannels,addChannel} = useContext(storeDataContext)
    const {setSelectedUser,setChatType,selectedUser,setChatMessages} = useUserStore();
    
    useEffect(()=>{
        const getAllContacts = async ()=>{
            try {
                const response = await axios.get(`${backendURL}/contacts/get-channel-contacts`,{withCredentials:true})
                console.log("useEffect response",response);
                setAllContacts(response.data.contacts)
            } catch (error) {
                console.log(error);
            }
        }
        getAllContacts()
    },[])

    const createChannel = async()=>{
        try {
            if(channelName.length>0 && selectedContacts.length>0){
                const response = await axios.post(`${backendURL}/channels/create`,{
                    name:channelName,
                    members:selectedContacts.map((contact)=>contact.value)  //because the selected user value contains userid of user which is set from backend
                },{withCredentials:true})
                if(response.status==200){
                    setSelectedContacts([])
                    setChannelName("")
                    setOpenChannelDialog(false)
                    addChannel(response.data.channel)
                }else{
                    toast.error(response.error.data.message || "something bad happens,Try again later!")
                }
            }
        } catch (error) {
            console.log(error) 
        }
    }
  return (
    <div className="mt-4">
        <div className=" flex justify-between items-center ">
            <h1 className="font-semibold text-[#ca83bf] uppercase">
            Channels
            </h1>
            <span onClick={()=>setOpenChannelDialog(true)} className="translate-y-2 font-semibold text-[#ca83bf]">
                <Tooltip>
                    <TooltipTrigger><Plus /></TooltipTrigger>
                    <TooltipContent>
                        <p>Select new Contact</p>
                    </TooltipContent>
                </Tooltip>
            </span>
        </div>
        <Dialog open={openChannelDialog} onOpenChange={(open)=>setOpenChannelDialog(false)}>
        <DialogContent className="w-[400px] h-[300px] bg-[#181920] text-white border-none flex flex-col">
            <DialogHeader>
                <DialogTitle>Create a Channel</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
                <input className="w-full p-2 border-none outline-none bg-[#2c2e3b] rounded-sm text-white "
                type="text" placeholder="Enter Channel name" onChange={(e)=>setChannelName(e.target.value)} value={channelName}/>
                <MultipleSelector className="w-full  border-none outline-none bg-[#2c2e3b] rounded-sm text-white "
                    defaultOptions={allContacts}
                    placeholder="Search contacts"
                    value={selectedContacts}
                    onChange={setSelectedContacts}
                    emptyIndicator={<p>No results found</p>}
                ></MultipleSelector>
                <button onClick={createChannel}
                className="bg-purple-700 hover:bg-purple-500 p-2 rounded-md font-semibold">Create</button>
            </div>
            
        </DialogContent>
        </Dialog>
        <div>

        </div>
        
    </div>
  );
};

    
export default Channel;
