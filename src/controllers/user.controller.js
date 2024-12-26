import User from "../model/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import PS from '../model/ps.model.js'
import qrcode from 'qrcode'
import { createCanvas,loadImage } from "canvas";
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
        secure:true,
        maxAge:7*24*60*60*1000,
    }

    return res
    .status(200)
    .cookie('token',token,options)
    .json(new ApiResponse(200,'Login successful',user))
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
        try {
            var options={
                errorCorrectionLevel:'H',
                type:'image/jpeg',
                quality:0.3,
                margin:1,
                color:{
                    dark: "#0C195F", 
                    light: "#D2FDFE"
                },
                width:300,
            }
            const canvas=createCanvas(300,300)
            await qrcode.toCanvas(canvas,user._id.toString(),options)

            const ctx=canvas.getContext('2d')
            const img=await loadImage('../dinosaur.png')
            const imgSize=50
            const centerX=(canvas.width-imgSize)/2
            const centerY=(canvas.height-imgSize)/2

            ctx.drawImage(img,centerX,centerY,imgSize,imgSize)
            const qr=canvas.toDataURL('image/jpeg')
            user.qr=qr
            await user.save()
            return res.status(200).json(new ApiResponse(200,'QR generated successfully',qr))
        } catch (error) {
            return res.status(500).json(new ApiResponse(500,error.message))
        }
    }
    else{
        return res.status(200).json(new ApiResponse(200,'QR already generated',user.qr))
    }
})

const getInfo=asyncHandler(async(req,res)=>{
    const user=req.user
    return res.status(200).json(new ApiResponse(200,'User info',user))
})


const qrForFood=asyncHandler(async(req,res)=>{
    const user=req.user
    const food=req.body.food
    var foodName=''
    if(food=='breakfast'){
        foodName='breakfast'
    }
    else if(food=='lunch'){
        foodName='lunch'
    }
    else if(food=='dinner'){
        foodName='dinner'
    }
    else if(food=='snacks'){
        foodName='snacks'
    }
    else{
        return res.status(400).json(new ApiResponse(400,'Invalid food type'))
    }

    try {
        var options={
            errorCorrectionLevel:'H',
            type:'image/jpeg',
            quality:0.3,
            margin:1,
            color:{
                dark: "#0C195F", 
                light: "#D2FDFE"
            },
            width:300,
        }
        const dataToEncode={
            _id:user._id,
            food:foodName
        }
        const qr=await qrcode.toDataURL(dataToEncode,options)
        return res.status(200).json(new ApiResponse(200,'QR generated successfully',qr))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,error.message))
    }
})

export {login,logout,viewPS,participantInfoQR,qrForFood,getInfo}  