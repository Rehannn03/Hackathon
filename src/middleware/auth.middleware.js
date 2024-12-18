import { asyncHandler } from "../utils/asyncHandler.js";
import  User from "../model/user.model.js";
import { ApiError } from "../utils/apiError.js";
import jwt from 'jsonwebtoken'
const verifyJWT=asyncHandler(async(req,_,next)=>{
    const token=req.cookies?.token || req.headers.authorization?.split(' ')[1]
    
    if(!token){
        throw new ApiError(401,'Unauthorized Access')
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET)

    const user=await User.findById(decoded._id).select('-password')

    if(!user){
        throw new ApiError(404,'User not found')
    }

    req.user=user
    next()
})

export default verifyJWT