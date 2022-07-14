import { asyncTryCatch } from "../middleware/tryCatch.js";
import ErrorHandler from "../utils/utilsErrorHandler.js";
import groupSchema from "./../Models/messageModel.js";
import cloudinary from "cloudinary"
import userSchema from "../Models/userModel.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const createGroup = asyncTryCatch(async(req,res,next)=>{
    const {name,desc,groupRole,avatar}=req.body;

    req.body.createBy=req.user._id;
    let members={};
    members={
        user:req.user._id,
        name:req.user.name,
        avatar:req.user.avatar,
        role:"master"
    }

    let group=await groupSchema.create({
        name,desc,groupRole,createBy:{user:req.body.createBy},
        avatar:{
            public_id:"sampleId",
            url:"sampleUrl"
        },
        members:members
    });

    const mycloud =req.body.avatar==="null"? null : await cloudinary.v2.uploader.upload(avatar,{
        folder:"ChatAppAvatars",
        width:150,
        crop:"scale"
    }) ;

    if(mycloud!==null){
        group=await groupSchema.findByIdAndUpdate(group._id,{
            avatar:{
                public_id:mycloud===null? "sampleId":mycloud.public_id ,
                url:mycloud===null?"sampleUrl":mycloud.secure_url 
            }
        })
    }

    let user=await userSchema.findById(req.user.id);

    user.groups.push(group._id);
    await user.save();

    return res.status(201).json({ success: true, group });
});


export const getAllGroups = asyncTryCatch(async(req,res,next)=>{
    let user=await userSchema.findById(req.user.id);
    let groupsId=user.groups;

    let apiFeatureForUserGroups = new ApiFeatures(groupSchema.find({_id:{$in:groupsId}}).populate({path:'createBy',populate:{path:"user",select:"name"}}).populate({path:"members",populate:{path:"user",select:"name avatar"}}), req.query).search();
    let apiFeature = new ApiFeatures(groupSchema.find({_id:{$nin:groupsId}}).populate() .populate({path:'createBy',populate:{path:"user",select:"name"}}).populate({path:"members",populate:{path:"user",select:"name avatar"}}), req.query).search();

    const userGroups=await apiFeatureForUserGroups.query;
    const groups=await apiFeature.query;

    // const userGroups=await groupSchema.find({_id:{$in:groupsId}});
    // const groups=await groupSchema.find({_id:{$nin:groupsId}});

    return res.status(201).json({ success: true, groups,userGroups});
});

export const sendMessage = asyncTryCatch(async(req,res,next)=>{

    const{groupId,message}=req.body;

    const group=await groupSchema.findById(groupId).select("+messages");

    if(!group){
        return next(new ErrorHandler("Group doesn't exist",404));
    }

    const userId=req.user.id;

    const user=await userSchema.findById(userId);

    if(!user){
        return next(new ErrorHandler("User doesn't exist",404));
    }

    const isMemberInGroup = group.members.find((e)=>(String(e.user)===String(userId)));

    if(!isMemberInGroup){
        return next(new ErrorHandler("Please join group to send message",400));
    }

    group.messages.push({user,message,name:user.name});


    await group.save();

    return res.status(200).json({success:true});

});

export const getAllMessages = asyncTryCatch(async(req,res,next)=>{

    const groupId=req.params.id;
    const group=await groupSchema.findById(groupId).select("+messages");

    if(!group){
        return next(new ErrorHandler("Group doesn't exist",404));
    }

    const user=req.user.id;

    const isMemberInGroup = group.members.find((e)=>(String(e.user)===String(user)));

    let messages=[];
    let memberRole

    if(isMemberInGroup){
        messages=group.messages;
        memberRole=isMemberInGroup.role;
    }


    return res.status(200).json({success:true,messages,isMemberInGroup,memberRole});
});

export const groupRolesHandler = asyncTryCatch(async(req,res,next)=>{

    const {groupId}=req.body;
    const userId=req.user.id;

    const group=await groupSchema.findById(groupId).select("+messages");

    if(!group){
        return next(new ErrorHandler("Group doesn't exist",404));
    }

    const isMemberInGroup = group.members.find((e)=>(String(e.user)===String(userId)));

    if(isMemberInGroup){

        if(isMemberInGroup.role==="master"){
            for (let i = 0; i < group.members.length; i++) {
                const user = await userSchema.findById(group.members[i].user);
                const userGroups=user.groups.filter((e)=>String(e)!==String(groupId));
                user.groups=userGroups;
                user.save();
            }
            if(group.avatar.public_id!=="sampleId")
                await cloudinary.v2.uploader.destroy(group.avatar.public_id);

            await group.delete();

            return res.status(200).json({success:true,message:`You Deleted ${group.name} Successfully`});

        }else{

            let members=group.members.filter((e)=>String(e.user)!==String(userId));
            group.members=members;
            
            const user=await userSchema.findById(userId);
            let userGroups=user.groups.filter((e)=>String(e)!==String(groupId));
            user.groups=userGroups;
            
            const adminMessage=`${user.name} Leave`;
            group.messages.push({message:adminMessage,name:"Admin"});
            
            group.save();
            user.save();

            return res.status(200).json({success:true,message:`You leave ${group.name} Successfully`,adminMessage});
        }

    }else{
        
        if(group.groupRole==="Invite only"){

            const isUserRequested=group.requested.find((e)=>String(e.user)===String(userId));

            if(isUserRequested){
                return next(new ErrorHandler("You already send requested",404));
            }

            const user=await userSchema.findById(userId);
            const adminMessage=`${user.name} requested to join`;

            group.messages.push({message:adminMessage,name:"Admin"});
            group.requested.push({user:userId,messageId:group.messages[group.messages.length-1]._id});
        
            const messageId=group.messages[group.messages.length-1]._id;


            group.save();

            return res.status(200).json({success:true,message:"Request Send Successfully",adminMessage,messageId});

        }else if(group.groupRole==="Closed"){
            return next(new ErrorHandler("Currently this group is closed",400));
        }else{  
            const user=await userSchema.findById(userId);

            if(group.members.length===50){
                return next(new ErrorHandler("Group is full",404));
            }
    
            let member={};
            member={
                user:user._id,
                name:user.name,
                avatar:user.avatar,
                role:"member"
            }
    
            group.members.push(member);
            user.groups.push(groupId);
            const adminMessage=`${user.name} Joined`;
            group.messages.push({message:adminMessage,name:"Admin"});
            
    
            user.save();
            group.save();
            return res.status(200).json({success:true,message:`You Join ${group.name} Successfully`,adminMessage});
   
        }

    }
});

export const acceptRejectRequestController = asyncTryCatch(async(req,res,next)=>{
    const {isAccepted,messageId,groupId}=req.body;

    const group=await groupSchema.findById(groupId).select("+messages");

    if(!group){
        return next(new ErrorHandler("Group doesn't exist",404));
    }
    
    const requestedUser=group.members.find((e)=>String(e.user)===String(req.user.id));

    if (requestedUser.role!=="master" && requestedUser.role!=="admin"){
        return next(new ErrorHandler(`${requestedUser.role} Cannot access this resources`,404));
    }

    const userRequested=group.requested.find((e)=>String(e.messageId)===String(messageId));

    if(!userRequested){
        return next(new ErrorHandler("This request is no longer available",404));
    }

    const user=await userSchema.findById(userRequested.user);
    if(!user){
        return next(new ErrorHandler("User not found",404));

    }
    
    if(isAccepted===String(1)){
        

        if(group.members.length===50){
            return next(new ErrorHandler("Group is full",404));
        }

        let member={};
        member={
            user:user._id,
            name:user.name,
            avatar:user.avatar,
            role:"member"
        }

        group.members.push(member);
        user.groups.push(groupId);
        const adminMessage=`${user.name} Joined`;
        group.messages.push({message:adminMessage,name:"Admin"});

        group.requested=group.requested.filter((e)=>(String(e.user)!==String(userRequested.user)));

        group.messages.find((e)=>String(e._id)===String(messageId)).message=`${req.user.name} accepted request of ${user.name}.`;
        

        user.save();
        group.save();
        return res.status(200).json({success:true,message:`You accepted request of ${user.name} Successfully`,adminMessage});

    }else{
        group.messages.find((e)=>String(e._id)===String(messageId)).message=`${req.user.name} rejected request of ${user.name}.`;
        group.requested=group.requested.filter((e)=>(String(e.user)!==String(userRequested.user)));

        group.save();

        return res.status(200).json({success:true,message:`You rejected request of ${user.name} Successfully`});

    }

});


export const memberRoleHandler = asyncTryCatch(async(req,res,next)=>{

    const {groupId,memberId,isKick}=req.body;

    const group=await groupSchema.findById(groupId).select("+messages");


    let member=group.members.find((e)=>String(e.user)===String(memberId));

    if(!member){
        return next(new ErrorHandler("User not found",404));
    }

    const requestedUser=group.members.find((e)=>String(e.user)===String(req.user.id));

    if ((requestedUser.role!=="master" && requestedUser.role!=="admin") || member.role==="master"){
        return next(new ErrorHandler(`${requestedUser.role} Cannot access this resources`,404));
    }

    const user=await userSchema.findById(member.user);

    if(isKick===String(1)){
        let members=group.members.filter((e)=>String(e.user)!==String(member.user));
        group.members=members;
        
        let userGroups=user.groups.filter((e)=>String(e)!==String(groupId));
        user.groups=userGroups;
        
        const adminMessage=`${req.user.name} kick ${user.name}.`;
        group.messages.push({message:adminMessage,name:"Admin"});
        
        group.save();
        user.save();

        return res.status(200).json({success:true,message:`You Kicked ${user.name} Successfully`,adminMessage});
    }else{
        if(member.role==="admin"){
            group.members.find((e)=>String(e.user)===String(memberId)).role="member";

            const adminMessage=`${req.user.name} demote ${user.name}.`;
            group.messages.push({message:adminMessage,name:"Admin"});

            group.save();

            return res.status(200).json({success:true,message:`You demoted ${user.name} Successfully`,adminMessage});
        }else{
            group.members.find((e)=>String(e.user)===String(memberId)).role="admin";

            const adminMessage=`${req.user.name} promote ${user.name}.`;
            group.messages.push({message:adminMessage,name:"Admin"});

            group.save();
            return res.status(200).json({success:true,message:`You promoted ${user.name} Successfully`,adminMessage});
        }
    }
});


export const updateGroup = asyncTryCatch(async(req,res,next)=>{

    const group=await groupSchema.findById(req.params.groupId);

    const requestedUser=group.members.find((e)=>String(e.user)===String(req.user.id));
    
    if(!requestedUser){
        return next(new ErrorHandler("User not found in this group",404));
    }

    if (requestedUser.role!=="master" && requestedUser.role!=="admin"){
        return next(new ErrorHandler(`${requestedUser.role} Cannot access this resources`,404));
    }

    if(req.body.avatar!=="null"){
        console.log(req.body.avatar)
        if(req.body.avatar.public_id!=="sampleId")
            await cloudinary.v2.uploader.destroy(group.avatar.public_id);

        const mycloud =await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"ChatAppAvatars",
            width:150,
            crop:"scale"
        }) ;

        req.body.avatar={
            public_id:mycloud===null? "sampleId":mycloud.public_id ,
            url:mycloud===null?"sampleUrl":mycloud.secure_url 
        }
        
        await groupSchema.findOneAndUpdate({_id:req.params.groupId},req.body,{new:true});  

    }

    await groupSchema.findOneAndUpdate({_id:req.params.groupId},{name:req.body.name,desc:req.body.desc,groupRole:req.body.groupRole},{new:true});

    return res.status(200).json({success:true});

});

