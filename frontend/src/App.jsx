import React, { useEffect, useState } from 'react'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Auth from './pages/auth/Auth'

import Chat from './pages/chat/Chat'
import useUserStore from '../store/userStore'
import Profile from './pages/profile/profile'
import axios from 'axios'

const App = () => {
  
  const [loading,setLoading] = useState(true)
  const {authUser,setAuthUser} = useUserStore();
  const backendURL = import.meta.env.VITE_backendURL

  
  const getUserInfo=async()=>{
    try{
      const response = await axios.get(`${backendURL}/auth/get-authuser`,{withCredentials:true});
      setAuthUser(response.data.user)
    }catch(error){
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(()=>{
    if(!authUser){
      getUserInfo()
    }else{
      setLoading(false);
    }
  },[authUser])
  
  const PrivateRoute = ({children})=>{
    const isauthenticated = authUser !== null;
    return isauthenticated ? children : <Navigate to="/auth" />;
  }

  const AuthRoute = ({children})=>{
    const isauthenticated = authUser !== null;
    return isauthenticated ? <Navigate to="/chat" /> : children;
  }

  if(loading){
    return <div className='h-screen w-full flex justify-center items-center '>
      <div className="w-10 h-10 border-4  border-gray-200 border-t-gray-900 rounded-full animate-spin" />
    </div>
  }
  return (
    <div className='overflow-hidden'>
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth/></AuthRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>}/>
        <Route path='/chat' element={<PrivateRoute><Chat/></PrivateRoute>} />
        <Route path='*'element={<Auth/>} />


      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
