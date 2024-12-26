import {
  addUser,
  leaderBoard,
  addTeam,
  getTeams,
  getParticipants,
  assignTeamsJudge,
  getJudges,
  getParticipantsNotAddedToTeam
} from "../controllers/superAdmin.controller.js";
import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { checkSuperAdmin } from "../middleware/admin.middleware.js";
const router = Router();

router.post("/addUser", verifyJWT, checkSuperAdmin, addUser);
router.get("/leaderBoard", verifyJWT, checkSuperAdmin, leaderBoard);
router.post("/addTeam", verifyJWT, checkSuperAdmin, addTeam);
router.get("/getTeams", verifyJWT, checkSuperAdmin, getTeams);
router.get("/getParticipants", verifyJWT, checkSuperAdmin, getParticipants);
router.post("/assignTeamsJudge", verifyJWT, checkSuperAdmin, assignTeamsJudge);
router.get("/getJudges", verifyJWT, checkSuperAdmin, getJudges);
router.get('/getParticipantsNotTeam',verifyJWT,checkSuperAdmin,getParticipantsNotAddedToTeam)
export default router;
