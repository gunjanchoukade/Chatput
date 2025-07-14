import express from "express"
import { getMessages ,imageUpload} from "../Controllers/messageController.js"
import { authenticateUser } from "../Middlewares/userMiddleware.js"
import upload from "../Middlewares/profileMiddleware.js"
const messageRouter = express.Router()


messageRouter.post('/getMessages',authenticateUser,getMessages)
messageRouter.post('/upload-image',authenticateUser,upload.single("image"),imageUpload)

export default messageRouter