import {Redis} from 'ioredis'

let redisClient

try {
    redisClient=new Redis({
        host:process.env.REDIS_HOST,
        port:process.env.REDIS_PORT,
        password:process.env.REDIS_PASSWORD,
        retryStrategy:(times)=>{
            if(times<=5){
                return 5000
            }
            return null
        }
    })

    redisClient.on('connect',()=>{
        console.log('Redis connected')
    })

    redisClient.on('error',(error)=>{
        console.log('Redis error',error)
    })
} catch (error) {
    console.error('Redis connection error',error)
}

export default redisClient