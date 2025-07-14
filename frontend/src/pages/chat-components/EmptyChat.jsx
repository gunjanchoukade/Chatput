import React, { useState } from 'react'
import useUserStore from '../../../store/userStore'



const EmptyChat = () => {
    const {selectedUser,setSelectedUser} = useUserStore();

  return (
    <div className={`bg-[#16161b] md:w-[70vw] h-[100vh] md:flex justify-center items-center hidden ${selectedUser !==null ? 'md:hidden' : ''}`}>
        <div className='flex flex-col justify-center items-center text-white gap-4'>
           <iframe src="https://lottie.host/embed/1fc980b4-f6ca-4815-a546-1b6660bb2555/x1jl2QTrrT.lottie"></iframe>
            <h1 className="text-2xl">
                <span className="text-yellow-400 text-3xl">Hi!!  </span>
                Welcome to <span className='text-white font-bold text-3xl animate-bounce'>Chatput  </span>
            </h1>
            <span className='text-gray-400'>Select a chat to start.</span>

        </div>
    </div>
  )
}

export default EmptyChat
