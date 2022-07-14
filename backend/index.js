import app from "./app.js";
import dotenv from "dotenv";
import database from "./Config/database.js";
import cloudinary from  "cloudinary";
import {Server} from "socket.io";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


if(process.env.PRODUCTION!=="production")
    dotenv.config({path:"backend/Config/config.env"});

const PORT=process.env.PORT;
database();


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET
})


// const server=http.createServer(app);

const server=app.listen((PORT),()=>{
    console.log(`Server is running http://localhost:${PORT}/`);
});

app.use(express.static(path.join(__dirname,"../chatapp/build")));
app.get("*",(req,res)=>(
    res.sendFile(path.resolve(__dirname,"../chatapp/build/index.html"))
))

const io=new Server(server);

io.on("connection",(socket)=>{

    socket.on("Message Send",(data)=>{
        try {
            io.emit("Received Message",data);
        } catch (error) {
            console.log(error);
        }
    })

});

