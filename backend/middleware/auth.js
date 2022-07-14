import ErrorHandler from "../utils/utilsErrorHandler.js";
import { asyncTryCatch } from "./tryCatch.js";
import jwt from "jsonwebtoken";
import userSchema from "../Models/userModel.js";

export const isUserHaveAuth=asyncTryCatch(async (req,res,next)=>{
    const cookie=req.cookies

    if(!cookie.token){
        return next(new ErrorHandler("Please Login to access this resources."));
    }
    
    const decodedData= jwt.verify(cookie.token,process.env.JWT_SECRET);
    req.user= await userSchema.findOne({_id:decodedData.id});
    return next();
});


export const userRole=(...roles)=>{
    return (req,res,next)=>{
        const user=req.user;
        const isUserAccesed= roles.includes(user.role);
        if(!isUserAccesed){  
            return next(new ErrorHandler(`${user.role} cannot access this resources`,401));
        }
        return next();
    }    
};
