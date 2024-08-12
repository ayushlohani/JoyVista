import express, { urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    optionSuccessStatus:200
}));

app.use(cookieParser());

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));

//TODO:import routes
import UserRouter from "./routes/user.route.js"

app.use("/api/v1/users",UserRouter);

export default app;