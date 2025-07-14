import jwt from "jsonwebtoken"

const authenticateUser = async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            res.status(400).json({message:"Not Authenticated"});
            return;
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.id=decoded.userId;
        next()
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Interval server error"});
    }
}

export {authenticateUser}