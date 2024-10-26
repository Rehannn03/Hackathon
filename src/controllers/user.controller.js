import User from "../model/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const login=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})

    if(!user){
        throw new ApiError(404,"User not found")
    }

    const isMatch=await user.isPasswordCorrect(password)

    if(!isMatch){
        throw new ApiError(400,"Invalid credentials")
    }

    const token=await user.generateAccessToken()
})