import mongoose from "mongoose";

const judgeSchema = new mongoose.Schema({
    judge:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    teamAssgined:[{
        teamId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
        },
        round:{
            type:String,
        }
    }],
    editedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},{
    timestamps:true
})

const Judge = mongoose.model("Judge", judgeSchema);

export default Judge;