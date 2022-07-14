import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail.js";
import crypto from "crypto"

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxlength:[30,"Name cannot exceed more than 30 characters"],
        minlength:[4,"Name must have 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validator:[isEmail,"Please Enter Validate Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minlength:[8,"Password must be 8 characters"],
        select :false      
    },
    avatar:{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:Date,
    },
    groups:[{
        type:mongoose.Schema.ObjectId,
        ref:"groupschemas",
        required:true
    }]

});

userSchema.pre("save",async function (){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    }   
});


userSchema.methods.generateJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRESIN
    });    
};

userSchema.methods.comparePassword =async function(password){
    return await bcrypt.compare(password,this.password);
};

userSchema.methods.generateResetPasswordToken = async function(){
    const resetToken = crypto.randomBytes(20).toString("hex"); /// it will see in url

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex"); // it just give,doesnot store in database
    this.resetPasswordExpire = Date.now() +( process.env.RESET_PASSWORD_EXPIRE_IN * 60 *1000);/// in min
    
    return resetToken;
}

export default mongoose.model("userSchema",userSchema);
