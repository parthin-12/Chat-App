import express from "express";
import users from "./Routes/userRoutes.js";
import groups from "./Routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { errorHandler } from "./middleware/error.js";
import fileUpload from "express-fileupload"

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());


//////Routes/////
app.use("/api/v1/",users);
app.use("/api/v1/",groups);
app.use(errorHandler);

export default app;