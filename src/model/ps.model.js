import mongoose from "mongoose";

const psSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    domain:{
        type:String,
        required:true
    },
    editedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},{
    timestamps:true
})


const PS = mongoose.model("PS", psSchema);

export default PS;