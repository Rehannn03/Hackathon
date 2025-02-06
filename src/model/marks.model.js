import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
    },
    judge:[{
        judgeAssigned:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
        round:{
            type:String,
        }
    }],
    criteria:[{
        type:Object,
        default:{
            innovation:{type:Number,default:0,required:true},
            presentation:{type:Number,default:0,required:true},
            feasibility:{type:Number,default:0,required:true},
            teamwork:{type:Number,default:0,required:true},
            proto:{type:Number,default:0,required:true}
        }
    }],
    total:[{
        round:{
            type:String,
        },
        score:{
            type:Number,
            default:0
        }
    }],
    feedback:[{
        type:String,
    }],
    editCount:{
        type:Number,
        default:0
    },
    grandTotal:{
        type:Number,
        default:0
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