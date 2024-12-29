import Judge from "../model/judges.model.js";
import Marks from '../model/marks.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
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


export {seeAssignedTeams,fillMarks,editMarks}