import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"


dotenv.config()

const hashPassword = async(password)=>{
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword  
}

const generateToken= async(userId,email)=>{
    const maxAge = 3 * 24 * 60 * 60 * 1000
    const token = jwt.sign({userId,email},process.env.JWT_SECRET_KEY,{
        expiresIn:maxAge,
    })
    return token;
}

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SEC_KEY
})


export {hashPassword,generateToken,cloudinary}