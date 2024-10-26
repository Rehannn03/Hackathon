import {
    seeAssignedTeams,fillMarks,editMarks
} from '../controllers/judge.controller.js'
import { Router } from 'express'
import verifyJWT from '../middleware/auth.middleware.js'
const router = Router()

router.get('/seeAssignedTeams',verifyJWT,seeAssignedTeams)
router.post('/fillMarks',verifyJWT,fillMarks)
router.put('/editMarks',verifyJWT,editMarks)

export default router