import {
    seeAssignedTeams,fillMarks,editMarks,viewPreviousMarks
} from '../controllers/judge.controller.js'
import { Router } from 'express'
import verifyJWT from '../middleware/auth.middleware.js'
const router = Router()

router.get('/seeAssignedTeams',verifyJWT,seeAssignedTeams)
router.post('/fillMarks',verifyJWT,fillMarks)
router.put('/editMarks',verifyJWT,editMarks)
router.get('/viewPreviousMarks/:teamName',verifyJWT,viewPreviousMarks)
export default router