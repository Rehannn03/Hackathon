import User from "../model/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import PS from '../model/ps.model.js'
import qrcode from 'qrcode'

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

    const options={
        httpOnly:true,
        SameSite:'None',
        secure:true
    }

    return res
    .status(200)
    .cookie('token',token,options)
    .json(new ApiResponse(200,'Login successful'))
})

const logout=asyncHandler(async(req,res)=>{
    res
    .status(200)
    .clearCookie('token')
    .json(new ApiResponse(200,'Logout successful'))
})

const viewPS=asyncHandler(async(req,res)=>{
    const user=req.user
    const ps=await PS.find({})

    return res
    .status(200)
    .json(new ApiResponse(200,'All PS',ps))
})

const participantInfoQR=asyncHandler(async(req,res)=>{
    const user=req.user

    if(user.role=='participant'&&user.checkIn==false){
        var options={
            errorCorrectionLevel:'H',
            type:'image/jpeg',
            quality:0.3,
            margin:1,
            color:{
                dark:"#000000FF",
                light:"#FFFFFFFF"
            },
            width:500,
        }
        const qr=await qrcode.toDataURL(user._id.toString())
        user.qr=qr
        await user.save()
    }
})


export {login,logout,viewPS}  