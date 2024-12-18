import {
    login,
    logout
} from '../controllers/user.controller.js'
import express from 'express'
import verifyJWT from '../middleware/auth.middleware.js'
const router=express.Router()

router.post('/login',login)
router.get('/logout',verifyJWT,logout)

export default router