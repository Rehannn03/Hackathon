import {
    login,
    logout,
    participantInfoQR,
    qrForFood,
    getInfo
} from '../controllers/user.controller.js'
import express from 'express'
import verifyJWT from '../middleware/auth.middleware.js'
const router=express.Router()

router.post('/login',login)
router.get('/logout',verifyJWT,logout)
router.get('/participantInfoQR',verifyJWT,participantInfoQR)
router.post('/qrForFood',verifyJWT,qrForFood)
router.get('/getInfo',verifyJWT,getInfo)
export default router