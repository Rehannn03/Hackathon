import {
    addUser, addTeam, getTeams, checkIn, bulkCheckIn ,getParticipants,assignTeamsJudge,leaderBoard
} from '../controllers/admin.controller.js'
import { Router } from 'express'
import verifyJWT from '../middleware/auth.middleware.js'
import { checkRole } from '../middleware/admin.middleware.js'

const router = Router()


router.post('/addUser',verifyJWT,checkRole,addUser)
router.get('/leaderBoard',verifyJWT,checkRole,leaderBoard)
router.post('/addTeam',verifyJWT,checkRole,addTeam)
router.get('/getTeams',verifyJWT,checkRole,getTeams)
router.post('/checkIn',verifyJWT,checkRole,checkIn)
router.post('/bulkCheckIn',verifyJWT,checkRole,bulkCheckIn)
router.get('/getParticipants',verifyJWT,checkRole,getParticipants)
router.post('/assignTeamsJudge',verifyJWT,checkRole,assignTeamsJudge)

export default router