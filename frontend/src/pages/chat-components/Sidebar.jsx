import React from 'react'
import { Edit, Edit2Icon, LogOut, Pencil, PenTool, Plus } from 'lucide-react'
import useUserStore from '../../../store/userStore'
import { getColor } from '../../lib/utils';
import NewDm from './NewDm';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ContactsForDm from './ContactsForDm';
import Channel from './Channels';
import ChannelsForDm from './ChannelsForDm';

const Sidebar = () => {
    const {authUser} = useUserStore();
    const backendURL = import.meta.env.VITE_backendURL
    const navigate = useNavigate()
    const {setAuthUser,selectedUser} = useUserStore()
    const handleLogout = async()=>{
        try {
            const response = await axios.delete(`${backendURL}/auth/logout`,{withCredentials:true});
            if(response.status === 200){
                setAuthUser(null);
                navigate('/auth');
                toast.success("Logged out successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

   
   
  return (
    <div 
    className={`relative md:w-[30vw] h-[100vh] w-full bg-[#16161b] border-r-2 border-r-[#505269]  text-white ${selectedUser !== null ? "hidden md:block" : ""}`}>
        <div className='h-full px-5'>
            <div className='flex gap-1 items-center mt-2 '>
                <img  src="https://img.icons8.com/color/48/filled-chat.png" />
                <h1 className='text-3xl font-bold text-yellow-300 -translate-y-1'>Chatput</h1>
            </div>
            <div className=''>
                <NewDm/>
                <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden mt-3'>
                    {/* //users for dm */}
                    <ContactsForDm/>
                </div>
            </div>
            <div>
                <Channel/>
                <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden mt-3'>
                    <ChannelsForDm/>
                </div>
            </div>
        </div>
        
        <div className='absolute flex justify-between items-center bottom-2 border-t-2 border-t-[#505269] w-full h-[6vh] px-3'>
            <div>
                {
                    authUser.profilePic  ? 
                    <div className='flex gap-2'>
                        <div className={`w-10 h-10 rounded-full ${getColor(authUser.color)} flex justify-center items-center text-2xl rounded-full `}>
                            <img src={authUser.profilePic}  className='w-10 rounded-full h-10 object-cover'/> 
                        </div>
                        <p className='text-lg uppercase font-semibold mt-1 text-white'>{authUser.firstName} {authUser.lastName}</p>
                    </div>
                    :
                    <div className='px-4 flex gap-2 items-center justify-between '>
                        <div className='flex gap-2'>
                            <div className={`w-10 h-10 uppercase rounded-full ${getColor(authUser.color)} flex justify-center items-center text-2xl  rounded-full `}>
                                <p>{authUser?.email?.split("").shift()}</p>   
                            </div>
                            <p className='text-lg uppercase font-semibold mt-1 text-white'>{authUser.firstName} {authUser.lastName}</p>
                        </div>
                        
                    </div>
                }
            </div>
            <div className='flex gap-8 mb-2'>
                <span onClick={()=>navigate('/profile')}
                    className='text-yellow-300 cursor-pointer'><Pencil/>
                </span>
                <span  onClick={handleLogout}
                    className='text-red-500 group relative'><LogOut/>
                    <p className='hidden group-hover:block absolute top-[-40px] right-2 text-gray-500 border-2 border-gray-500 p-1 rounded-lg
                    font-semibold text-sm bg-[#5f24090f]'>Logout</p>
                </span>
            </div>
        </div>
    </div>
  )
}

export default Sidebar
