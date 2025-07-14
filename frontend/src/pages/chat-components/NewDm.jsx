import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import {Tooltip,TooltipContent,TooltipTrigger,} from "@/components/ui/tooltip"
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios";
import { getColor } from "../../lib/utils";
import useUserStore from "../../../store/userStore";

const NewDm = () => {
    const [openDialog,setOpenDialog] = useState(false);
    const [searchedContacts,setSearchedContacts]  = useState([]);
    const backendURL = import.meta.env.VITE_backendURL

    const handleSearchingUser = async (searchedUser)=>{
        try {
            if(searchedUser.length>0){
                const response = await axios.post(`${backendURL}/contacts/get-user`,{searchedUser},{withCredentials:true});
                setSearchedContacts(response.data.contacts)
                console.log(response.data.contacts)
            }else{
                setSearchedContacts([])
            }
        } catch (error) {
            
        }
    }
    const {setSelectedUser,setChatType,selectedUser,setChatMessages} = useUserStore();
    
    const handleSelectedContact =(contact)=>{
        setSelectedUser(contact);
        setChatType('contact');
        setOpenDialog(false)
        setSearchedContacts([])
    }
    
  return (
    <div className="mt-4">
        <div className=" flex justify-between items-center ">
            <h1 className="font-semibold text-[#ca83bf] uppercase">
            Direct Message
            </h1>
            <span onClick={()=>setOpenDialog(true)} className="translate-y-2 font-semibold text-[#ca83bf]">
                <Tooltip>
                    <TooltipTrigger><Plus /></TooltipTrigger>
                    <TooltipContent>
                        <p>Select new Contact</p>
                    </TooltipContent>
                </Tooltip>
            </span>
        </div>
        <Dialog open={openDialog} onOpenChange={(open)=>setOpenDialog(false)}>
        <DialogContent className="w-[400px] h-[400px] bg-[#181920] text-white border-none flex flex-col">
            <DialogHeader>
                <DialogTitle>Please select a contact</DialogTitle>
            </DialogHeader>
            <div>
                <input  onChange={(event)=>handleSearchingUser(event.target.value)}
                type="text " placeholder="search for users" className="w-full p-2 border-none outline-none bg-[#2c2e3b] rounded-sm text-white " />
            </div>
            <ScrollArea className={`border-none outline-none h-[300px] md:w-[350px] w-full  border ${searchedContacts.length >0 ? 'block' : 'hidden'}`}>
                <div className="flex flex-col gap-3 ">
                    {searchedContacts.map((contact, index) => (
                        <div onClick={()=>handleSelectedContact(contact)}
                        key={index} className="hover:bg-gray-800 py-2">
                        {
                            contact.profileSetup == true ? 
                            <div className="flex gap-3 items-center">
                                <div className="relative w-15 h-15  rounded-full bg-contain flex items-center">
                                    <img  className="w-15 h-15 rounded-full object-contain "
                                    src={contact.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"} alt="profile image" /> 
                                </div>
                                <div>
                                        <p className="text-lg">{contact.firstName && contact.lastName ? `${contact.firstName+" "+contact.lastName}` : contact.email}</p>
                                        <p className="text-gray-500">{contact.email}</p>
                                </div>
                            </div>
                            : 
                            <div className="flex gap-3  items-center">
                                <div className={` relative w-15 h-15 rounded-full uppercase ${contact.color ? getColor(contact.color) : getColor(0)} flex  justify-center items-center text-4xl`}>
                                    {contact?.email?.split("").shift()}      
                                </div>
                                <div>
                                    <p className="text-lg">{contact.firstName && contact.lastName ? `${contact.firstName+" "+contact.lastName}` : contact.email}</p>
                                    <p className="text-gray-500">{contact.email}</p>
                                </div>
                            </div>
                        }
                        </div>
                    ))}
                </div>
            </ScrollArea>
            {
                searchedContacts.length <=0 && <div>
                    <div className='flex flex-col justify-center items-center text-white gap-4'>
                        <iframe src="https://lottie.host/embed/1fc980b4-f6ca-4815-a546-1b6660bb2555/x1jl2QTrrT.lottie"></iframe>
                        <h1 className="text-2xl">
                            <span className="text-yellow-400 text-3xl">Hi!!  </span>
                            Welcome to <span className='text-white font-bold text-3xl animate-bounce'>Chatput  </span>
                        </h1>
                        <span className='text-gray-400'>Search new Contact.</span>
                    </div>
                </div>
            }
        </DialogContent>
        </Dialog>
        <div>

        </div>
        
    </div>
  );
};

    
export default NewDm;
