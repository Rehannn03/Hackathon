import {
  addUser,
  addTeam,
  bulkAddUser,
  getTeams,
  checkInbyEmail,
  bulkCheckIn,
  getParticipants,
  assignTeamsJudge,
  leaderBoard,
  addPS,
  checkInByQr,
  foodQr,
  getCheckedInUsers,
  getNotCheckedInParticipants,
  getPS
} from "../controllers/admin.controller.js";
import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { cacheMiddleware } from "../middleware/redis.middleware.js";
import { REDIS_KEYS } from "../utils/redisConstants.js";
const router = Router();

router.post("/addUser", verifyJWT, checkRole, addUser);
// router.get('/leaderBoard',verifyJWT,checkRole,leaderBoard)
router.post("/addTeam", verifyJWT, checkRole, addTeam);
router.post(
  "/bulkAddUser",
  verifyJWT,
  checkRole,
  upload.single("file"),
  bulkAddUser
);
router.get("/getTeams", verifyJWT, checkRole,cacheMiddleware(REDIS_KEYS.TEAM,REDIS_KEYS.EXPIRY.MEDIUM), getTeams);
router.post("/checkIn", verifyJWT, checkRole, checkInbyEmail);
router.post("/bulkCheckIn", verifyJWT, checkRole, bulkCheckIn);
router.get("/getParticipants", verifyJWT, checkRole, cacheMiddleware(REDIS_KEYS.USER.LIST,REDIS_KEYS.EXPIRY.SHORT),getParticipants);
router.post("/addPS", verifyJWT, checkRole, addPS);
router.post("/checkInByQr", verifyJWT, checkRole, checkInByQr);
router.post("/foodQr", verifyJWT, checkRole, foodQr);
router.get("/getCheckedInUsers", verifyJWT, checkRole, cacheMiddleware(REDIS_KEYS.USER.LIST,REDIS_KEYS.EXPIRY.SHORT),getCheckedInUsers);
router.get('/notCheckIn',verifyJWT,checkRole,cacheMiddleware(REDIS_KEYS.USER.LIST,REDIS_KEYS.EXPIRY.SHORT),getNotCheckedInParticipants)
router.get('/getPS',verifyJWT,checkRole,cacheMiddleware(REDIS_KEYS.PS,REDIS_KEYS.EXPIRY.MEDIUM),getPS)
// router.post('/assignTeamsJudge',verifyJWT,checkRole,assignTeamsJudge)

export default router;
