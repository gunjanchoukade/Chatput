import express from "express"
import { signUp,login,getAuthUser,updateProfile,profileChanger,removeProfile,logoutUser} from "../Controllers/userController.js";
import {authenticateUser} from "../Middlewares/userMiddleware.js"
import upload from "../Middlewares/profileMiddleware.js";
const userRouter = express.Router();



userRouter.post('/signup',signUp);  
userRouter.post('/login',login);  
userRouter.get('/get-authuser',authenticateUser,getAuthUser)
userRouter.post('/update-profile',authenticateUser,updateProfile)
userRouter.post('/update-profile-pic',authenticateUser,upload.single("profilePic"),profileChanger)
userRouter.delete('/remove-profile-pic',authenticateUser,removeProfile)
userRouter.delete('/logout',authenticateUser,logoutUser)
export default userRouter;