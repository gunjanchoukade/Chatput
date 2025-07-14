import React from 'react'
import { useContext } from 'react'
import { storeDataContext } from '../../context/StoreContext'
import { useEffect } from 'react'
import axios from 'axios'
import useUserStore from '../../../store/userStore'

const ChannelsForDm = () => {
    const {channels,setChannels} = useContext(storeDataContext)
    const backendURL = import.meta.env.VITE_backendURL
    const {setChatType,setSelectedUser} = useUserStore()
    const getChannels = async()=>{
        try {
            const response = await axios.get(`${backendURL}/channels/get-channels`,{withCredentials:true})
            if(response.status==200){
                console.log("channels",response.data.channels)
                setChannels(response.data.channels)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        getChannels()
    },[])

    const handleClick = (channel)=>{
        setChatType("channel");
        setSelectedUser(channel);
    }
  return (
    <div>
      <div className='flex flex-col gap-1'>
        {
            channels.map((channel,index)=>(
                <div onClick={()=>handleClick(channel)}
                className={` py-2 transition-all duration-300 cursor-pointer  `}
                key={index}>
                {
                    
                    <div className="flex gap-3 items-center">
                        <div className="relative w-12 h-12  rounded-full bg-contain flex items-center">
                            <img  className="w-12 h-12 rounded-full object-contain "
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbpwe2E5hQR-HbTt1BmaC1QY_Z5ehYSICiyw&s" alt="channel image" /> 
                        </div>
                        <div>
                            <p className="text-lg">{channel.name}</p>
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

export default ChannelsForDm
