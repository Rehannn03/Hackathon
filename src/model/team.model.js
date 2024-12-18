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
    }
},{
    timestamps:true
})

const Team = mongoose.model("Team", teamSchema);

export default Team;