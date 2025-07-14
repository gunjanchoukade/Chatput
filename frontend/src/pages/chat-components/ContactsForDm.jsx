import React from 'react'
import useUserStore from '../../../store/userStore'
import { getColor } from '../../lib/utils'
import { useContext } from 'react'
import { socketDataContext } from '../../context/socketContext'
import { useEffect } from 'react'
import { storeDataContext } from '../../context/StoreContext'
import axios from 'axios'

const ContactsForDm = ({isChannel=false}) => {
    const{selectedUser,setSelectedUser,chatType,setChatType,setChatMessages} = useUserStore()
    const backendURL = import.meta.env.VITE_backendURL

    const handleClick = (contact)=>{
        if(isChannel){
            setChatType("channel");
        }else{
            setChatType("contact")
            setSelectedUser(contact)
            if(selectedUser && selectedUser._id !== contact._id){
                setChatMessages([])
            }
        }
    }
    const {usersForDM,setUsersForDM} = useContext(storeDataContext)
    useEffect(()=>{
        
        const fetchUsers = async () => {
            console.log("called")
            try {
                const response = await axios.get(`${backendURL}/contacts/get-users-fordm`,{withCredentials:true})
                if(response.data && response.data.contacts) {
                    setUsersForDM(response.data.contacts);
                   
                }
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        };
        fetchUsers();
        
    }, []);

    return (
    <div>
        <div className='flex flex-col gap-1'>
        {
            usersForDM.map((contact,index)=>(
                <div onClick={()=>handleClick(contact)}
                className={` py-2 transition-all duration-300 cursor-pointer ${selectedUser && (selectedUser._id == contact._id) ? "bg-[#52475f]" : "hover:bg-[#f1f1f111]"} `}
                key={index}>
                {
                    contact.profileSetup == true ? 
                    <div className="flex gap-3 items-center">
                        <div className="relative w-12 h-12  rounded-full bg-contain flex items-center">
                            <img  className="w-12 h-12 rounded-full object-contain "
                            src={contact.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"} alt="profile image" /> 
                        </div>
                        <div>
                                <p className="text-lg">{contact.firstName && contact.lastName ? `${contact.firstName+" "+contact.lastName}` : contact.email}</p>
                                <p className="text-gray-500">{contact.email}</p>
                        </div>
                    </div>
                    : 
                    <div className="flex gap-3  items-center">
                        <div className={` relative w-12 h-12 rounded-full uppercase ${contact.color ? getColor(contact.color) : getColor(0)} flex  justify-center items-center text-4xl`}>
                            {contact?.email?.split("").shift()}      
                        </div>
                        <div>
                            <p className="text-lg">{contact.firstName && contact.lastName ? `${contact.firstName+" "+contact.lastName}` : contact.email}</p>
                            <p className="text-gray-500">{contact.email}</p>
                        </div>
                    </div>
                }
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default ContactsForDm
