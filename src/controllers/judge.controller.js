import Judge from "../model/judges.model.js";
import Marks from '../model/marks.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";
const ObjectId=mongoose.Types.ObjectId
const seeAssignedTeams = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const teams = await Judge.aggregate([
      {
          $match: {
              judge: user
          }
      },
      {
          $lookup: {
              from: "teams",
              localField: "teamAssgined",
              foreignField: "_id",
              as: "teamAssigned"
          }
      },
      {
          $unwind: "$teamAssigned"
      },
      {
          $group: {
              _id: null,
              teamAssigned: {
                  $push: {
                      teamId: "$teamAssigned._id",
                      teamName: "$teamAssigned.teamName"
                  }
              }
          }
      },
      {
          $project: {
              _id: 0,
              teamAssigned: 1
          }
      }
  ]);

  return res.status(200).json(new ApiResponse(200, teams));
});

const fillMarks=asyncHandler(async(req,res)=>{
    const user=req.user._id
    const {teamName,innovation,presentation,feasibility,teamwork,prototype,feedback}=req.body
    console.log(req.body)
    const total = parseFloat(innovation) + parseFloat(presentation) + parseFloat(feasibility) + parseFloat(teamwork) + parseFloat(prototype);
    const marks=await Marks.create({
        team:teamName,
        judge:user,
        criteria:{
            innovation,
            presentation,
            feasibility,
            teamwork,
            proto:prototype
        },
        total,
        feedback,
        editedBy:user
    })

    return res.status(201).json(new ApiResponse(201,marks))
})

const editMarks=asyncHandler(async(req,res)=>{
    const user=req.user._id
    const {teamName,innovation,presentation,feasibility,teamwork,prototype,feedback}=req.body
    const total = parseFloat(innovation) + parseFloat(presentation) + parseFloat(feasibility) + parseFloat(teamwork) + parseFloat(prototype);
    const marks=await Marks.findOneAndUpdate({
        team:teamName,
        judge:user
    },{
        criteria:{
            innovation,
            presentation,
            feasibility,
            teamwork,
            proto:prototype
        },
        total,
        feedback,
        editedBy:user
    })

    return res.status(201).json(new ApiResponse(201,marks))
})

const viewPreviousMarks=asyncHandler(async(req,res)=>{
    const user=req.user._id
    const {teamName}=req.params
    console.log(teamName)
    console.log(user)
    const marks=await Marks.aggregate([
        {
            $match:{
                team:new ObjectId(teamName),
                judge:new ObjectId(user)
            }
        },
        {
            $lookup:{
                from:"teams",
                localField:"team",
                foreignField:"_id",
                as:"teams"
            }
        },
        {
            $unwind:"$teams"
        },
        {
            $project:{
                _id:0,
                teamName:"$teams.teamName",
                criteria:1,
                total:1,
                feedback:1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200,marks))
})


export {seeAssignedTeams,fillMarks,editMarks,viewPreviousMarks}