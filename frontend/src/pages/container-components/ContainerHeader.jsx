import { Croissant, Cross, CrossIcon, XIcon } from 'lucide-react'
import React from 'react'
import useUserStore from '../../../store/userStore'
import { getColor } from '../../lib/utils'

const ContainerHeader = () => {
  const {setSelectedUser,selectedUser,chatType} = useUserStore()
  
  return (
    <div className='h-[10vh] border-b-[#505269] border-b-2 flex justify-between items-center px-4'>
      
      {chatType === "contact" ? 
        <div className="hover:bg-gray-800 p-2">
        {
          selectedUser !== null ?
          selectedUser.profileSetup == true ? 
          <div className="flex gap-3 items-center">
              <div className="relative w-15 h-15 rounded-full bg-contain flex justify-center items-center">
                  <img  className="w-15 h-15 rounded-full object-contain "
                  src={selectedUser.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"} alt="profile image" /> 
              </div>
              <div>
                      <p className="text-lg">{selectedUser.firstName && selectedUser.lastName ? `${selectedUser.firstName+" "+selectedUser.lastName}` : selectedUser.email}</p>
                      <p className="text-gray-500">{selectedUser.email}</p>
              </div>
          </div>
          : 
          <div className="flex gap-3 items-center">
              <div className={` relative w-15 h-15 rounded-full uppercase ${getColor(selectedUser.color)} flex justify-center items-center text-4xl`}>
                  {selectedUser?.email?.split("").shift()}      
              </div>
              <div>
                  <p className="text-lg">{selectedUser.firstName && selectedUser.lastName ? `${selectedUser.firstName+" "+selectedUser.lastName}` : selectedUser.email}</p>
                  <p className="text-gray-500">{selectedUser.email}</p>
              </div>
          </div>
          :
          <div>

          </div>
        }
        </div>
        :
        <div className="flex gap-3 items-center">
          <div className="relative w-12 h-12  rounded-full bg-contain flex items-center">
              <img  className="w-12 h-12 rounded-full object-contain "
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbpwe2E5hQR-HbTt1BmaC1QY_Z5ehYSICiyw&s" alt="channel image" /> 
          </div>
          <div>
              <p className="text-lg">{selectedUser?.name}</p>
          </div>
        </div>
      }


      <div onClick={()=>setSelectedUser(null)}>
          <XIcon/>
        </div>
      </div>
  )
}

export default ContainerHeader
