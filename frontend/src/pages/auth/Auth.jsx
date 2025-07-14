import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authPageImage } from '../../assets/assets.js'; // Adjust the path as necessary
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../../store/userStore.js';
const Auth = () => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const backendURL = import.meta.env.VITE_backendURL

    const navigate = useNavigate();
    const {setAuthUser} = useUserStore();
    const validate=()=>{
        if(!email || !password){
            toast.error("All fields are required");
            return false;
        }

        if(password.length < 6) {
            toast.error("Password must be atleast 6 characters long")
            return false;
        }
        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    }
    const validateLogin = ()=>{
        if(!email || !password){
            toast.error("All fields are required");
            return false;
        }
        if(password.length<6){
            toast.error("Password must be atleast 6 characters long");
            return false;
        }
        return true;
    }
    const handleSignup = async (e)=>{
        e.preventDefault();
        try{
            if(validate()){
                const response = await axios.post(`${backendURL}/auth/signup`,{email,password},{withCredentials:true});
                if(response.status === 200){
                    toast.success("SignUp Successfull");
                    setEmail("");
                    setPassword("");    
                    setConfirmPassword("");
                    navigate('/profile');
                }
            }
        }catch(error){
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    const handleLogin = async(e)=>{
        try {
            e.preventDefault();
            if(validateLogin()){
                const response = await axios.post(`${backendURL}/auth/login`,{email,password},{withCredentials:true});
                if(response.status==200){
                    setAuthUser(response.data.user);
                    toast.success("Login Successfull")
                    if(response.data.user.profileSetup){
                        navigate('/chat');
                    }else{
                        navigate('/profile');
                    }
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "something is wrong!try again later.")
        }
    }
    
  return (
    <div className='h-[100vh] w-[100vw] flex justify-center items-center bg-gray-100'>
        <div className='lg:h-[70vh] md:h-[60vh] h-[50vh] w-[80vh] flex flex-col justify-between  shadow-2xl border-2 border-white bg-white rounded-xl px-2 mx-3'>
            <div className='flex flex-col gap-4 '>
                <div className='text-center rounded-t-xl mt-10'>
                    <h1 className='text-3xl font-semibold text-yellow-600 animate-bounce'>Welcome!</h1>
                    <h1 className='text-gray-500 font-medium'>Fill in details to get Started with Chatput</h1>
                </div>
                <div className='w-full mt-5   px-4 h-[100%]'>
                    <Tabs defaultValue="account" className=" h-[100%]" defaultValue="Login">
                        <TabsList className="flex justify-between bg-transparent w-full gap-2  transition-shadow ease-in-out duration-300">
                            <TabsTrigger value="Login" className="data-[state=active]:bg-green-500 h-[40px] data-[state=active]:text-white ">Login</TabsTrigger>
                            <TabsTrigger value="SignUp" className="data-[state=active]:bg-green-500 h-[40px] data-[state=active]:text-white ">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Login" className="h-[100%] mt-2">
                            <div className='flex flex-col gap-4 justify-start  h-[100%] '>
                                <input onChange={(e)=>setEmail(e.target.value)} value={email} type="text" placeholder='example@gmail.com' className='w-full border-black border-2 outline-none  p-2' />
                                <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='***********' className='w-full border-black border-2 outline-none  p-2' />
                                <button
                                onClick={handleLogin}
                                className='w-full bg-black font-semibold text-lg p-2 text-white'>Login</button>
                            </div>
                        </TabsContent>
                        <TabsContent value="SignUp"  className="h-[100%] mt-2">
                            <div className='flex flex-col gap-4 justify-start  h-[100%] '>
                                <input onChange={(e)=>setEmail(e.target.value)} value={email} type="text" placeholder='example@gmail.com' className='w-full border-black border-2 outline-none  p-2' />
                                <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Enter your password' className='w-full border-black border-2 outline-none  p-2' />
                                <input onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} 
                                type="password" placeholder='confirm password' className='w-full border-black border-2 outline-none  p-2' />
                                <button 
                                onClick={handleSignup}
                                className='w-full bg-black font-semibold text-lg p-2 text-white'>Signup</button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            

        </div>
      
    </div>
  )
}

export default Auth
