import Judge from "../model/judges.model.js";
import Marks from '../model/marks.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";
const ObjectId=mongoose.Types.ObjectId
const seeAssignedTeams = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const {round}=req.params
  const teams = await Judge.aggregate([
    {
      $match: {
        judge:user
      }
    },
    {
      $project: {
        teamAssgined:{
          $filter:{
            input:'$teamAssgined',
            as:'team',
            cond:{$eq:['$$team.round',round]}
          }
        }
      }
    },
    {
      $unwind:'$teamAssgined'
    },
    {
      $lookup: {
        from: 'teams',
        localField: 'teamAssgined.teamId',
        foreignField: '_id',
        as: 'teamDetails'
      }
    },{
      $unwind:'$teamDetails'
    },{
      $group: {
        _id: null,
        teamAssgined:{
          $push:{
            teamId:'$teamDetails._id',
            teamName:'$teamDetails.teamName',
            round:'$teamAssgined.round'
          }
        }
      }
    },{
      $project: {
        _id:0,
        teamAssgined:1
      }
    }
 ]);

  return res.status(200).json(new ApiResponse(200, teams));
});

const fillMarks=asyncHandler(async(req,res)=>{
    const user=req.user._id
    const {teamName,innovation,presentation,feasibility,teamwork,prototype,feedback,round}=req.body
    const totalScore = parseFloat(innovation) + parseFloat(presentation) + parseFloat(feasibility) + parseFloat(teamwork) + parseFloat(prototype);
    const check=await Marks.findOne({
        team:teamName,
    })
    if(check && !check.judge.includes(user)){
        const marks=await Marks.findOneAndUpdate({
            team:teamName
        },{
            $push:{
              judge:{
                    judgeAssigned:user,
                    round:round
                }
            ,
              criteria:{
                innovation,
                presentation,
                feasibility,
                teamwork,
                proto:prototype
            },
              total:{
                    round,
                    score:totalScore
                },
              feedback,
            },
            $inc:{editCount:1,grandTotal:totalScore}
        },{
            new:true
        })
        return res.status(201).json(new ApiResponse(201,marks)) 
    }
    else{
    const marks=await Marks.create({
        team:teamName,
        judge:[
            {
                judgeAssigned:user,
                round:round
            }
        ],
        criteria:{
            innovation,
            presentation,
            feasibility,
            teamwork,
            proto:prototype
        },
            total:{
                round,
                score:totalScore
            }
        ,
        feedback,
        editCount:1,
        grandTotal:totalScore,
        editedBy:user
    })

    return res.status(201).json(new ApiResponse(201,marks))
}
})

const editMarks = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { teamName, round, innovation, presentation, feasibility, teamwork, prototype, feedback } = req.body;
  const totalScore = parseFloat(innovation) + parseFloat(presentation) + parseFloat(feasibility) + parseFloat(teamwork) + parseFloat(prototype);


  const marks = await Marks.findOne({ team: teamName });

  if (!marks) {
      return res.status(404).json(new ApiError(404, "Marks record not found"));
  }


  const judgeEntry = marks.judge.find(j => j.judgeAssigned.toString() === user.toString() && j.round === round);
  
  if (!judgeEntry) {
      return res.status(403).json(new ApiError(403, "You are not assigned as a judge for this round"));
  }


  if (marks.editCount >= 4) {
      return res.status(400).json(new ApiError(400, "Cannot edit marks more than 2 times"));
  }


  const roundIndex = marks.criteria.findIndex((_, index) => marks.total[index].round === round);
  
  if (roundIndex === -1) {
      return res.status(400).json(new ApiError(400, "Invalid round"));
  }


  marks.criteria[roundIndex] = { innovation, presentation, feasibility, teamwork, proto: prototype };


  marks.total[roundIndex].score = totalScore;


  marks.grandTotal = marks.total.reduce((sum, entry) => sum + entry.score, 0);


  if (feedback) {
      marks.feedback.push(feedback);
  }


  marks.editCount += 1;
  marks.editedBy = user;

  // Save the updated document
  await marks.save();

  return res.status(200).json(new ApiResponse(200, marks, "Marks updated successfully"));
});

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
                editCount:1,
                total:1,
                feedback:1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200,marks))
})


export {seeAssignedTeams,fillMarks,editMarks,viewPreviousMarks}