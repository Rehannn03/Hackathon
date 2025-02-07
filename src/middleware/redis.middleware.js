import redisClient from "../db/redis.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const cacheMiddleware=(prefix,expiration)=> async(req,res,next)=>{
    try {
        const key=`${prefix}:${req.originalUrl}`
        const cache=await redisClient.get(key)

        if(cache){
            const data=JSON.parse(cache)
            return res.status(200).json(new ApiResponse(200,data))
        }

        const originalJson=res.json
        res.json=function(body){
            if(body.success){
                const data=JSON.stringify(body.data)
                redisClient.setex(key,expiration,data)
            }

            return originalJson.call(this,body)
        }

        next()
    } catch (error) {
        next(error)
    }
}