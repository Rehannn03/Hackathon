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
  getNotCheckedInParticipants
} from "../controllers/admin.controller.js";
import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
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
router.get("/getTeams", verifyJWT, checkRole, getTeams);
router.post("/checkIn", verifyJWT, checkRole, checkInbyEmail);
router.post("/bulkCheckIn", verifyJWT, checkRole, bulkCheckIn);
router.get("/getParticipants", verifyJWT, checkRole, getParticipants);
router.post("/addPS", verifyJWT, checkRole, addPS);
router.post("/checkInByQr", verifyJWT, checkRole, checkInByQr);
router.post("/foodQr", verifyJWT, checkRole, foodQr);
router.get("/getCheckedInUsers", verifyJWT, checkRole, getCheckedInUsers);
router.get('/notCheckIn',verifyJWT,checkRole,getNotCheckedInParticipants)
// router.post('/assignTeamsJudge',verifyJWT,checkRole,assignTeamsJudge)

export default router;
