import mongoose from "mongoose";
// type:String,
// required:true

const messageSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please Enter Group Name"],
        maxlength:[10,"Group name cannot exceed more than 10 characters"],
        minlength:[4,"Group name must have 4 characters"]
    },
    desc:{
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    groupRole:{
        type:String,
        default:"Any one can Join"
    },
    createBy:{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"userSchema",
            required:true
        }
    },
    createAt: {
        type: Date,
        default: Date.now
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
    members:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"userSchema",
            required:true
        },
        role:{
            type:String,
            default:"member"
        }
    }],
    messages:{
        type:[{
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"userschemas",
            },
            name:{
                type:String,
                required:true
            },
            message:{
                type:String,
                required:true,
            },
            createAt:{
                type:Date,
                default:Date.now
            }
        }],
        select:false,
    },

    requested:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"userschemas",
        },
        messageId:{
            type:mongoose.Schema.ObjectId,
        }
    }]

});

export default mongoose.model("messageSchema",messageSchema);