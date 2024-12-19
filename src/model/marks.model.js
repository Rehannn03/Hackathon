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
            innovation:{type:Number,default:0,required:true},
            presentation:{type:Number,default:0,required:true},
            feasibility:{type:Number,default:0,required:true},
            teamwork:{type:Number,default:0,required:true},
            proto:{type:Number,default:0,required:true}
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
    }
},{
    timestamps:true
})

const Marks = mongoose.model("Marks", marksSchema);

export default Marks;