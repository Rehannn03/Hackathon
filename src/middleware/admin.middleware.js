
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const checkRole=asyncHandler(async(req,res,next)=>{
    const user=req.user
    if(user.role!='admin'){
        throw new ApiError(401,'Unauthorized')
    }
    next()
})

const checkSuperAdmin=asyncHandler(async(req,res,next)=>{
    const user=req.user

    if(user.role!='superAdmin'){
        throw new ApiError(401,'Unauthorized')
    }
    next()
})

export {checkRole,checkSuperAdmin}