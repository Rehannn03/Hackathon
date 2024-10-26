import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
    },
    judge:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    criteria:{
        type:Object,
        default:{
            innovation:0,
            presentation:0,
            feasibility:0,
            teamwork:0,
            prototype:0
        }
    },
    total:{
        type:Number,
        default:0
    },
    feedback:{
        type:String,
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

const Marks = mongoose.model("Marks", marksSchema);

export default Marks;