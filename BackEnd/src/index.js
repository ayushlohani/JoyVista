import app from "./app.js"
import { connectDb } from "./db/connectDb.js"
import "dotenv/config"

connectDb().then(()=>{
    app.on("error",(err)=>{
        console.log(err);
        throw err;
    })

    app.listen(8000,()=>{
        console.log("App is listening on port 8000 go to http://localhost:8000/");
    })
}
).catch((err)=>{
    console.log(err);
})