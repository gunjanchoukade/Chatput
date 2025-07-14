import express from "express"
import { authenticateUser } from "../Middlewares/userMiddleware.js"
import { createChannel,getChannelsForSidebar,getChannelMessages} from "../Controllers/channelController.js"


const channelRouter = express.Router()
channelRouter.post("/create",authenticateUser,createChannel)
channelRouter.get("/get-channels",authenticateUser,getChannelsForSidebar)
channelRouter.get('/get-channel-messages/:channelId',authenticateUser,getChannelMessages)

export default channelRouter