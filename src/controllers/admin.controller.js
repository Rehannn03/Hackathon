import  User  from "../model/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Team from "../model/team.model.js";
import jwt from 'jsonwebtoken'
import csvParser from "csv-parser";
import fs from 'fs'
import Judge from "../model/judges.model.js";
import Marks from "../model/marks.model.js";
const addUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, workplace } = req.body;
  if(role=='superAdmin'){
    throw new ApiError(400,'You are not allowed to create super admin')
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

const bulkAddUser=asyncHandler(async(req,res)=>{
    const csvFilePath=req.file?.path

    fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data',async(data)=>{
      const {name,email,password, role,workplace}=data
        
    })
})



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
      $lookup:{
        from:'users',
        localField:'editedBy',
        foreignField:'_id',
        as:'editedBy'
      }
    },
    {
      $unwind:'$editedBy'
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

const checkInbyEmail=asyncHandler(async(req,res)=>{
  const {email}=req.body
  
  const user=await User.findOneAndUpdate(
    {email},
    {checkIn:true,
    editedBy:req.user._id
    },
    {new:true}
  )

  if(!user){
    throw new ApiError(404,'User not found')
  }

  return res.status(200).json(new ApiResponse(200,user,'User checked in successfully'))
})

const bulkCheckIn = asyncHandler(async (req,res)=>{
    const ids=req.body.ids

    const users=await User.updateMany(
        {_id:{$in:ids}},
        {checkIn:true}
    )

    if(!users){
        throw new ApiError(404,'Users not found')
    }

    res.status(200).json(new ApiResponse(200,users))
})

const getParticipants=asyncHandler(async (req,res)=>{
    const users=await User.find({role:'participant'}).select('name email workplace food')

    if(!users){
        throw new ApiError(404,'No participants found')
    }

    res.status(200).json(new ApiResponse(200,users))
})

const generateQR=asyncHandler(async(req,res)=>{
  const id=req.params.id

})

const assignTeamsJudge=asyncHandler(async(req,res)=>{
  const {judgeId,teamId}=req.body

  const judge=await Judge.findByIdAndUpdate(
    judgeId,
    {$push:{teamAssgined:teamId},
    editedBy:req.user._id
    },
    {new:true}
  )

  if(!judge){
    const judge=await Judge.create({
      judge:judgeId,
      teamAssgined:[teamId],
      editedBy:req.user._id
    })

    return res.status(201).json(new ApiResponse(201,judge))
  }

  return res.status(200).json(new ApiResponse(200,judge))
})


const leaderBoard=asyncHandler(async(req,res)=>{
  const marks=await Marks.aggregate([
    {
      $lookup:{
        from:'teams',
        localField:'team',
        foreignField:'_id',
        as:'team'
      }
    },
    {
      $unwind:'$team'
    },{
      $lookup:{
        from:'users',
        localField:'judge',
        foreignField:'_id',
        as:'judge'
      }
    },
    {
      $unwind:'$judge'
    },
    {
      $project:{
        _id:0,
        teamName:'$team.teamName',
        judgeName:'$judge.name',
        innovation:1,
        presentation:1,
        feasibility:1,
        teamwork:1,
        total:1
      }
    }
  ])

  if(!marks){
    throw new ApiError(404,'No marks found')
  }

  res.status(200).json(new ApiResponse(200,marks))
})



export { addUser, addTeam, getTeams, checkInbyEmail, bulkCheckIn ,getParticipants,assignTeamsJudge,leaderBoard};
