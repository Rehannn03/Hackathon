
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const checkRole=asyncHandler((req,res,next)=>{
    const user=req.user

    if(user.role!='admin'){
        throw new ApiError(401,'Unauthorized')
    }
    next()
})

export {checkRole}