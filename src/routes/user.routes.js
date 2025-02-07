import {
    login,
    logout,
    participantInfoQR,
    qrForFood,
    getInfo,
    viewPS
} from '../controllers/user.controller.js'
import express from 'express'
import verifyJWT from '../middleware/auth.middleware.js'
import { cacheMiddleware } from '../middleware/redis.middleware.js'
import { REDIS_KEYS } from '../utils/redisConstants.js'
const router=express.Router()

router.post('/login',login)
router.get('/logout',verifyJWT,logout)
router.get('/participantInfoQR',verifyJWT,participantInfoQR)
router.post('/qrForFood',verifyJWT,qrForFood)
router.get('/getInfo',verifyJWT,getInfo)
router.get('/viewPS',verifyJWT,cacheMiddleware(REDIS_KEYS.PS,REDIS_KEYS.EXPIRY.MEDIUM),viewPS)
export default router