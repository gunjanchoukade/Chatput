import express from "express"
import { getSearchedUser ,getAllUsers,getUsersForDm,usersForChannel} from "../Controllers/contactController.js"
import { authenticateUser } from "../Middlewares/userMiddleware.js"
const contactRouter = express.Router()

//this is to send the searched user to logged user
contactRouter.post("/get-user",authenticateUser,getSearchedUser)
contactRouter.post("get-allUsers",authenticateUser,getAllUsers)
contactRouter.get("/get-users-fordm",authenticateUser,getUsersForDm)
contactRouter.get('/get-channel-contacts',authenticateUser,usersForChannel)

export default contactRouter