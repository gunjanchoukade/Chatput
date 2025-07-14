import React from 'react'
import { useState } from 'react'
import { createContext } from 'react'


export const storeDataContext = createContext()
const StoreContext = ({children}) => {
    const[usersForDM,setUsersForDM] = useState([])
    const [channels,setChannels] = useState([])
    function addChannel(channel){
      setChannels((prev)=>[...prev,channel]);
    }
    const value={
      usersForDM,setUsersForDM,
      channels,setChannels,
      addChannel
    }
  return (
    <storeDataContext.Provider value={value}>
    {children}
    </storeDataContext.Provider>
  )
}

export default StoreContext
