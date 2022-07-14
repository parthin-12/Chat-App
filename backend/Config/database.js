import mongoose from "mongoose";

const connectDatabase=()=>{
    mongoose.connect(process.env.DATABASE_URL).then((data)=>{
        console.log(`Database is Connected with Server ${data.connection.name}`);
    });
}

export default connectDatabase;