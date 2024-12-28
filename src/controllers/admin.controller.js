import User from "../model/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Team from "../model/team.model.js";
import jwt from "jsonwebtoken";
import csv from "csvtojson";
import fs from "fs";
import Judge from "../model/judges.model.js";
import Marks from "../model/marks.model.js";
import PS from "../model/ps.model.js";
const addUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, workplace } = req.body;
  if (role == "superAdmin") {
    throw new ApiError(400, "You are not allowed to create super admin");
  }
  const user = await User.create({
    name,
    email,
    password,
    role,
    workplace,
    editedBy: req.user._id,
  });
  if (!user) {
    throw new ApiError(400, "User not created");
  }
  res.status(201).json(new ApiResponse(201, user));
});

const bulkAddUser = asyncHandler(async (req, res) => {
  var army = [];
  csv()
    .fromFile(req.file.path)
    .then((jsonObj) => {
      for (var i = 0; i < jsonObj.length; i++) {
        var obj = {};
        obj.name = jsonObj[i].name;
        obj.email = jsonObj[i].email;
        obj.password = jsonObj[i].password;
        obj.role = jsonObj[i].role;
        obj.workplace = jsonObj[i].workplace;
        army.push(obj);
      }
      const armyWithEdits = army.map((user) => ({
        ...user,
        editedBy: req.user._id,
      }));
      const user = User.insertMany(armyWithEdits)
        .then(() => {
          fs.unlinkSync(req.file.path);
          return res
            .status(201)
            .json(new ApiResponse(201, user, "Users added successfully"));
        })
        .catch((err) => {
          return res.status(400).json({ message: err.message });
        });
    })
    .catch((err) => {
      return res.status(400).json({ message: err.message });
    });
});

const addTeam = asyncHandler(async (req, res) => {
  const { teamName, teamLead, teamMembers } = req.body;
  const team = await Team.create({
    teamName,
    teamLead,
    teamMembers,
    editedBy: req.user._id,
  });
  if (!team) {
    throw new ApiError(400, "Team not created");
  }

  res.status(201).json(new ApiResponse(201, team));
});

const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "teamMembers",
        foreignField: "_id",
        as: "teamMembers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "editedBy",
        foreignField: "_id",
        as: "editedBy",
      },
    },
    {
      $unwind: "$editedBy",
    },
    {
      $project: {
        teamName: 1,
        teamLead: 1,
        teamMembers: {
          name: 1,
          email: 1,
          workplace: 1,
        },
        editedBy: {
          name: 1,
          email: 1,
          role: 1,
        },
      },
    },
  ]);
  if (!teams) {
    throw new ApiError(404, "No teams found");
  }
  res.status(200).json(new ApiResponse(200, teams));
});

const checkInbyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOneAndUpdate(
    { email },
    { checkIn: true, editedBy: req.user._id },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User checked in successfully"));
});

const bulkCheckIn = asyncHandler(async (req, res) => {
  const ids = req.body.ids;

  const users = await User.updateMany({ _id: { $in: ids } }, { checkIn: true });

  if (!users) {
    throw new ApiError(404, "Users not found");
  }

  res.status(200).json(new ApiResponse(200, users));
});

const checkInByQr = asyncHandler(async (req, res) => {
  const { qrData } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: qrData },
    { checkIn: true, editedBy: req.user._id },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User checked in successfully"));
});

const foodQr = asyncHandler(async (req, res) => {
  const { qrData } = req.body;
  const foodName = qrData.foodName;
  const user = await User.findOneAndUpdate(
    { _id: qrData._id },
    {
      food: {
        ...user.food,
        [foodName]: 1,
      },
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Food added successfully"));
});

const getParticipants = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "participant" }).select(
    "name email workplace food"
  );

  if (!users) {
    throw new ApiError(404, "No participants found");
  }

  res.status(200).json(new ApiResponse(200, users));
});

const getCheckedInUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ checkIn: true }).select(
    "name email workplace food"
  );

  if (!users) {
    throw new ApiError(404, "No users found");
  }

  res.status(200).json(new ApiResponse(200, users));
});

const assignTeamsJudge = asyncHandler(async (req, res) => {
  const { judgeId, teamId } = req.body;

  const judge = await Judge.findByIdAndUpdate(
    judgeId,
    { $push: { teamAssgined: teamId }, editedBy: req.user._id },
    { new: true }
  );

  if (!judge) {
    const judge = await Judge.create({
      judge: judgeId,
      teamAssgined: [teamId],
      editedBy: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, judge));
  }

  return res.status(200).json(new ApiResponse(200, judge));
});

const leaderBoard = asyncHandler(async (req, res) => {
  const marks = await Marks.aggregate([
    {
      $lookup: {
        from: "teams",
        localField: "team",
        foreignField: "_id",
        as: "team",
      },
    },
    {
      $unwind: "$team",
    },
    {
      $lookup: {
        from: "users",
        localField: "judge",
        foreignField: "_id",
        as: "judge",
      },
    },
    {
      $unwind: "$judge",
    },
    {
      $project: {
        _id: 0,
        teamName: "$team.teamName",
        judgeName: "$judge.name",
        innovation: 1,
        presentation: 1,
        feasibility: 1,
        teamwork: 1,
        total: 1,
      },
    },
  ]);

  if (!marks) {
    throw new ApiError(404, "No marks found");
  }

  res.status(200).json(new ApiResponse(200, marks));
});

const addPS = asyncHandler(async (req, res) => {
  const { title, description, domain } = req.body;

  const ps = await PS.create({
    title,
    description,
    domain,
    editedBy: req.user._id,
  });

  if (!ps) {
    throw new ApiError(400, "PS not created");
  }

  return res.status(201).json(new ApiResponse(201, ps));
});

const getNotCheckedInParticipants=asyncHandler(async(req,res)=>{
  const users=await User.find({role:"participant",checkIn:false}).select("name email workplace")
  if(!users){
    throw new ApiError(404,"No participants found")
  }
  return res.status(200).json(new ApiResponse(200,users))
})


export {
  addUser,
  addTeam,
  bulkAddUser,
  getTeams,
  checkInbyEmail,
  bulkCheckIn,
  checkInByQr,
  foodQr,
  getParticipants,
  assignTeamsJudge,
  leaderBoard,
  addPS,
  getCheckedInUsers,
  getNotCheckedInParticipants
};
