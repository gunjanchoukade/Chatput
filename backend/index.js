import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors"
import cookieParser from 'cookie-parser';
import userRouter from './Routes/userRoutes.js';
import contactRouter from './Routes/contactRoutes.js';
import messageRouter from './Routes/messageRoutes.js';
import socketSetup from './socket.js';
import channelRouter from './Routes/channelRoutes.js';
import http from "http"

dotenv.config();


const app  = express();
app.use(cors({
    origin:[process.env.origin,"https://chatput-frontend.onrender.com"],
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())


app.use('/auth',userRouter);
app.use('/contacts',contactRouter)
app.use('/messages',messageRouter)
app.use('/channels',channelRouter)
app.use('/',(req,res)=>{
    res.send("Api working")
})
const server = http.createServer(app);
server.listen(process.env.PORT,async ()=>{
    await mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("Connected to the DB");
    })
    console.log("Server is running on port",process.env.PORT)
})

socketSetup(server);
