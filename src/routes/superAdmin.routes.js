import {
  addUser,
  leaderBoard,
  addTeam,
  getTeams,
  getParticipants,
  assignTeamsJudge,
  getJudges,
  getAssignedJudges,
  getParticipantsNotAddedToTeam
} from "../controllers/superAdmin.controller.js";
import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { checkSuperAdmin } from "../middleware/admin.middleware.js";
import { REDIS_KEYS } from "../utils/redisConstants.js";
import { cacheMiddleware } from "../middleware/redis.middleware.js";
const router = Router();

router.post("/addUser", verifyJWT, checkSuperAdmin, addUser);
router.get("/leaderBoard", verifyJWT, checkSuperAdmin,cacheMiddleware(REDIS_KEYS.LEADERBOARD,REDIS_KEYS.EXPIRY.LONG), leaderBoard);
router.post("/addTeam", verifyJWT, checkSuperAdmin, addTeam);
router.get("/getTeams", verifyJWT, checkSuperAdmin,cacheMiddleware(REDIS_KEYS.TEAM,REDIS_KEYS.EXPIRY.MEDIUM), getTeams);
router.get("/getParticipants", verifyJWT, checkSuperAdmin,cacheMiddleware(REDIS_KEYS.USER.LIST,REDIS_KEYS.EXPIRY.SHORT), getParticipants);
router.post("/assignTeamsJudge", verifyJWT, checkSuperAdmin, assignTeamsJudge);
router.get("/getAssignedJudges", verifyJWT, checkSuperAdmin,cacheMiddleware(REDIS_KEYS.JUDGE.ASSIGNED,REDIS_KEYS.EXPIRY.MEDIUM), getAssignedJudges);
router.get("/getJudges", verifyJWT, checkSuperAdmin,cacheMiddleware(REDIS_KEYS.JUDGE.LIST,REDIS_KEYS.EXPIRY.MEDIUM), getJudges);
router.get('/getParticipantsNotTeam',verifyJWT,checkSuperAdmin,cacheMiddleware(REDIS_KEYS.USER.LIST,REDIS_KEYS.EXPIRY.SHORT),getParticipantsNotAddedToTeam)
export default router;
