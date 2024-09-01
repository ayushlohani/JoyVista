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
import PostRouter from "./routes/post.route.js"

const base_url = "/api/v1"
app.use(`${base_url}/users`,UserRouter);
app.use(`${base_url}/post`,PostRouter);

export default app;