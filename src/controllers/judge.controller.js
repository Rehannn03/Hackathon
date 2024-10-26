import Judge from "../model/judges.model.js";
import Marks from '../model/marks.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";


const seeAssignedTeams=asyncHandler(async(req,res)=>{
    const user=req.user.id
    const teams=await Judge.aggregate([
        {
            $match:{
                _id:user
            }
        },
        {
            $lookup:{
                from:'$teams',
                localField:'teamAssigned',
                foreignField:'teamName',
                as:'teamAssigned'
            }
        },
        {
            $unwind:'$teamAssigned'
        },
        {
            $project:{
                _id:0,
                teamAssigned:1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200,teams))
})

const fillMarks=asyncHandler(async(req,res)=>{
    const user=req.user.id
    const {teamName,innovation,presentation,feasibility,teamwork,prototype,feedback}=req.body
    const total=parseInt(innovation)+parseInt(presentation)+parseInt(feasibility)+parseInt(teamwork)+parseInt(prototype)
    const marks=await Marks.create({
        team:teamName,
        judge:user,
        criteria:{
            innovation,
            presentation,
            feasibility,
            teamwork,
            prototype
        },
        total,
        feedback
    })

    return res.status(201).json(new ApiResponse(201,marks))
})

const editMarks=asyncHandler(async(req,res)=>{
    const user=req.user.id
    const {teamName,innovation,presentation,feasibility,teamwork,prototype,feedback}=req.body
    const total=parseInt(innovation)+parseInt(presentation)+parseInt(feasibility)+parseInt(teamwork)+parseInt(prototype)
    const marks=await Marks.findOneAndUpdate({
        team:teamName,
        judge:user
    },{
        criteria:{
            innovation,
            presentation,
            feasibility,
            teamwork,
            prototype
        },
        total,
        feedback
    })

    return res.status(201).json(new ApiResponse(201,marks))
})


export {seeAssignedTeams,fillMarks,editMarks}