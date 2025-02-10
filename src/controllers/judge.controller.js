import Judge from "../model/judges.model.js";
import Marks from '../model/marks.model.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";
import { redisKeys } from "../utils/redisKeys.js";
import { REDIS_KEYS } from "../utils/redisConstants.js";
const ObjectId = mongoose.Types.ObjectId;

const seeAssignedTeams = asyncHandler(async (req, res) => {
    const user = req.user._id;
    const { round } = req.params;
    const teams = await Judge.aggregate([
        {
            $match: {
                judge: user
            }
        },
        {
            $project: {
                teamAssgined: {
                    $filter: {
                        input: '$teamAssgined',
                        as: 'team',
                        cond: { $eq: ['$$team.round', round] }
                    }
                }
            }
        },
        {
            $unwind: '$teamAssgined'
        },
        {
            $lookup: {
                from: 'teams',
                localField: 'teamAssgined.teamId',
                foreignField: '_id',
                as: 'teamDetails'
            }
        }, {
            $unwind: '$teamDetails'
        }, {
            $group: {
                _id: null,
                teamAssgined: {
                    $push: {
                        teamId: '$teamDetails._id',
                        teamName: '$teamDetails.teamName',
                        round: '$teamAssgined.round'
                    }
                }
            }
        }, {
            $project: {
                _id: 0,
                teamAssgined: 1
            }
        }
    ]);
    if(teams.length===0){
        return res.status(404).json(new ApiError(404, null,"No teams found"));
    }
    const cache=await redisKeys.get(`${REDIS_KEYS.JUDGE.ASSIGNED}:${user}`)
    if(cache){
        return res.status(200).json(new ApiResponse(200, cache));
    } else {
        await redisKeys.set(`${REDIS_KEYS.JUDGE.ASSIGNED}:${user}`,teams,REDIS_KEYS.EXPIRY.MEDIUM)
        return res.status(200).json(new ApiResponse(200, teams));
    }
    
});

const fillMarks = asyncHandler(async (req, res) => {
    const user = req.user._id;
    const { teamName, innovation, presentation, feasibility, teamwork, prototype, feedback, round } = req.body;
    const totalScore = parseFloat(innovation) + parseFloat(presentation) + parseFloat(feasibility) + parseFloat(teamwork) + parseFloat(prototype);
    const check = await Marks.findOne({
        team: teamName,
    });
    if (check && !check.judge.includes(user)) {
        const marks = await Marks.findOneAndUpdate({
            team: teamName
        }, {
            $push: {
                judge: {
                    judgeAssigned: user,
                    round: round
                },
                criteria: {
                    innovation,
                    presentation,
                    feasibility,
                    teamwork,
                    proto: prototype
                },
                total: {
                    round,
                    score: totalScore
                },
                feedback,
            },
            $inc: { editCount: 1, grandTotal: totalScore }
        }, {
            new: true
        });
        return res.status(201).json(new ApiResponse(201, marks));
    } else {
        const marks = await Marks.create({
            team: teamName,
            judge: [
                {
                    judgeAssigned: user,
                    round: round
                }
            ],
            criteria: {
                innovation,
                presentation,
                feasibility,
                teamwork,
                proto: prototype
            },
            total: {
                round,
                score: totalScore
            },
            feedback,
            editCount: 1,
            grandTotal: totalScore,
            editedBy: user
        });
        await Promise.all([
            redisKeys.clearCache(`${REDIS_KEYS.LEADERBOARD}:*`)
        ])
        return res.status(201).json(new ApiResponse(201, marks));
    }
});

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

    if (marks.editCount >= 6) {
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

    await marks.save();
    await Promise.all([
        redisKeys.clearCache(`${REDIS_KEYS.LEADERBOARD}:*`),
        redisKeys.clearCache(`${REDIS_KEYS.JUDGE.MARKS}:${user}:${teamName}`)
    ])
    return res.status(200).json(new ApiResponse(200, marks, "Marks updated successfully"));
});

const viewPreviousMarks = asyncHandler(async (req, res) => {
    const user = req.user._id;
    const { teamName } = req.params;
    console.log(teamName);
    const marks = await Marks.findOne(
        {
            team: teamName,
            "judge.judgeAssigned": user, // Fetch only the marks given by the logged-in judge
        }
    ).select("criteria total feedback grandTotal editCount judge");

    if (!marks) {
        throw new ApiError(404, "No previous marks found for this team.");
    }

    // Filter the judge's specific rounds
    const judgeRounds = marks.judge.filter(j => j.judgeAssigned.toString() === user.toString());

    // Get the rounds and corresponding scores
    const previousMarks = judgeRounds.map(judge => {
        const round = judge.round;
        const roundIndex = marks.total.findIndex(t => t.round === round);

        return {
            round,
            criteria: marks.criteria[roundIndex], // Get criteria scores for this round
            score: marks.total[roundIndex]?.score || 0, // Get total score for this round
            feedback: marks.feedback[roundIndex] || "",
        };
    });
    
    if(marks.length===0){
        return res.status(404).json(new ApiError(404, null,"No marks found"));
    }

    const cache=await redisKeys.get(`${REDIS_KEYS.JUDGE.MARKS}:${user}:${teamName}`)
    if(cache){
        return res.status(200).json(new ApiResponse(200, cache));
    } else{
        await redisKeys.set(`${REDIS_KEYS.JUDGE.MARKS}:${user}:${teamName}`,previousMarks,REDIS_KEYS.EXPIRY.MEDIUM)
        return res.status(200).json(new ApiResponse(200, previousMarks));
    }
});

export { seeAssignedTeams, fillMarks, editMarks, viewPreviousMarks };