import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
    },
    teamMembers: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    teamLead: {
        type: String,
        required: true,
    },
    editedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    time:{
        type:Date,
        default:Date.now
    }
})

const Team = mongoose.model("Team", teamSchema);

export default Team;