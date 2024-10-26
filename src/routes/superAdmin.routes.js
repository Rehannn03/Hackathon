import {
    addUser,leaderBoard,addTeam,getTeams,getParticipants,assignTeamsJudge
} from '../controllers/superAdmin.controller.js'
import { Router } from 'express'
import verifyJWT from '../middleware/auth.middleware.js'
const router = Router()


router.post('/addUser',verifyJWT,addUser)
router.get('/leaderBoard',verifyJWT,leaderBoard)
router.post('/addTeam',verifyJWT,addTeam)
router.get('/getTeams',verifyJWT,getTeams)
router.get('/getParticipants',verifyJWT,getParticipants)
router.post('/assignTeamsJudge',verifyJWT,assignTeamsJudge)

export default router