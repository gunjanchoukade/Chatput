import React, { useEffect, useState } from "react";
import useUserStore from "../../../store/userStore";
import {colors,getColor} from "../../lib/utils"
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { authUser,setAuthUser } = useUserStore();
  const [firstName,setFirstname] = useState("")
  const [lastName,setLastname] = useState("")
  const [profilePic,setProfilePic] = useState(null)
  const [selectedColor,setSelectedColor]=useState(0);
  const backendURL = import.meta.env.VITE_backendURL;

  const navigate = useNavigate();
  const validateProfile=()=>{
    if(!firstName){
      toast.error("First Name is required");
      return false;
    }
    if(!lastName){
      toast.error("Last Name is required");
      return false;
    }
    return true;
  }

  const saveChanges = async ()=>{
    if(validateProfile()){
      try {
        const response = await axios.post(`${backendURL}/auth/update-profile`,{firstName,lastName,color:selectedColor},{withCredentials:true})
        if(response.status === 200){
          toast.success("Profile updated successfully");
          setAuthUser(response.data.user)
          setFirstname("");
          setLastname("");
          setSelectedColor(0);
          setProfilePic("");
          navigate('/chat');
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  }
  const handleProfileImage = async (e)=>{
    const file = e.target.files[0];
    if(!file){
      toast.error("Please select an Image");
      return;
    }
    setProfilePic(file);
    const formData = new FormData();
    formData.append("profilePic",file);
    try {
      const response = await axios.post(`${backendURL}/auth/update-profile-pic`,formData,{withCredentials:true});
      if(response.status==200){
        setAuthUser(response.data.user);
        toast.success("Profile pic updated successfully");
      }else{
        toast.error("Pls try again later.!")
      }

    } catch (error) {
      console.log("error",error)
      toast.error(error?.response?.data?.message || "something went wrong")
    }


  }
  const deleteProfile = async ()=>{
    try {
      const response = await axios.delete(`${backendURL}/auth/remove-profile-pic`,{withCredentials:true});
      if(response.status === 200){
        setProfilePic(null);
        toast.success("Profile pic removed successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }
  useEffect(()=>{
    if(authUser.profileSetup){
      setFirstname(authUser.firstName);
      setLastname(authUser.lastName);
      setSelectedColor(authUser.color);
      if(authUser.profilePic!==""){
        setProfilePic(authUser.profilePic);
      }else{
        setProfilePic(null);
      }
    }
  },[])

  const backButton=()=>{
    if(authUser.profileSetup){
      navigate('/chat')
    }else{
      toast.error("Please complete your profile!");
      return;
    }
  }
  return (
    // "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
    // bg-[#1b1c24]
    <div className=" bg-[#1b1c24] h-screen w-full flex  justify-center items-center">

      <div className="md:w-[40vw] w-full flex flex-col gap-6">
        <img onClick={backButton} className="bg-white rounded-full cursor-pointer ml-5" width="24" height="24" src="https://img.icons8.com/material-outlined/24/left.png" alt="left"/>
        <div className="flex justify-center gap-5 md:gap-10 lg:gap-20 items-center px-10">
          {/* first one for profile and second is for info */}
          <div>
          {
            profilePic !==null ? 
            <div className="relative w-30 h-30 md:w-40 md:h-40 rounded-full bg-contain flex justify-center items-center">
              <img  className="w-30 h-30 md:w-40 md:h-40 rounded-full object-contain "
              src={authUser.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"} alt="profile image" /> 

              <img  onClick={deleteProfile}
              className="absolute right-0 md:right-3 bottom-2  rounded-full cursor-pointer bg-white p-1"
              width="30" height="30" src="https://img.icons8.com/material-rounded/24/filled-trash.png" alt="filled-trash" />
            </div> 
            : 
            <div className={` relative w-30 h-30 md:w-40 md:h-40 rounded-full ${getColor(selectedColor)} flex justify-center items-center text-5xl`}>
              {authUser?.email?.split("").shift()}
              <label htmlFor="input" className="group">
                <img  className="absolute right-1 md:right-3 bottom-2 bg-gray-300 rounded-full cursor-pointer"
                width="30" height="30" src="https://img.icons8.com/ios/100/plus--v1.png" alt="plus--v1"/>
                <p 
                className="opacity-0 group-hover:opacity-100 transition-opacity ease-in duration-300 text-xs text-gray-300 font-semibold absolute bottom-[-20px] right-[-40px] p-1 bg-transparent rounded-lg">
                update profile.</p>
              </label>
              <input onChange={handleProfileImage} type="file" hidden id="input"/>
            </div>
          }
          </div>
          {/*  */}
          <div className="flex flex-col gap-4">
            <input className="bg-[#2c2e3b] text-white outline-none p-2 rounded-md" type="text" placeholder="email" value={authUser.email} disabled />
            <input onChange={(e)=>setFirstname(e.target.value)} value={firstName} className="bg-[#2c2e3b] text-white outline-none p-2 rounded-md" type="text" placeholder="First Name" />
            <input onChange={(e)=>setLastname(e.target.value)} value={lastName} className="bg-[#2c2e3b] text-white outline-none p-2 rounded-md" type="text" placeholder="Last Name" />
            <div className="flex gap-5 justify-end">
            {
              colors.map((color,index)=>{
                return (
                  <div key={index}
                  onClick={()=>setSelectedColor(index)}
                  className={`${color} w-6 h-6 rounded-full ${selectedColor == index ? "outline-white outline-2" : ""}`}></div>
                )
              })
            }
            </div>
          </div>
        </div>
        <div className="flex justify-center px-5">
          <button 
            onClick={saveChanges}
            className="hover:bg-blue-400 bg-blue-500 text-lg text-white font-semibold p-2  lg:w-[430px] w-full rounded-md">Save changes</button>
        </div>

      </div>

    </div>
  );
};

export default Profile;
