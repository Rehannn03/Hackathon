import redisClient from "../db/redis.js";

export const redisKeys={
    async set(key,value,expiration){
        return await redisClient.setex(key,expiration,JSON.stringify(value))
    },

    async get(key){
        const data=await redisClient.get(key)
        return data? JSON.parse(data):null
    },

    async del(key){
        return await redisClient.del(key)
    },

    async clearCache(pattern){
        const keys=await redisClient.keys(pattern)
        if(keys.length>0){
            return await redisClient.del(keys)
        }
        return 0
    }
}