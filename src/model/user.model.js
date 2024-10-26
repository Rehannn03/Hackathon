import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
    },
    food:{
        type:Object,
        default:{
            breakfast:0,
            lunch:0,
            dinner:0,
            snacks:0
        }
    },
    qr:{
        type:String
    },
    workplace:{
        type:String,
    },
    checkIn:{
        type:Boolean,
        default:false
    },
    editedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    time:{
        type:Date,
        default:Date.now
    }
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }
    
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRY
        }
    )
}


const User = mongoose.model("User", userSchema);

export default User;