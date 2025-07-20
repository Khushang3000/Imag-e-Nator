// npm install cloudinary cors dotenv express mongoose nodemon openai  
//cloudinary for images and openai for...well yk.

import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";

import { connectDB } from "./mongodb/connect.js";

dotenv.config(); //allows us to pull all of our environment variables from the .env file.



const app = express();//initialize the express app.

app.use(cors());
app.use(express.json({limit: '50mb'}))//when someone sends a request with JSON data (like from a POST request), parse the JSON body so I can use it in req.body, limit:50mb means each request can send maximum data of 50mb.
//middlewares btw, notice .use


//these api endpoints will be called by the frontend
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle/', dalleRoutes);


//firstly middlewares(that are specified for this page routes are not those) are to be cleared to reach here.
app.get('/', (req, res)=>{
    res.send('Hello From ImagiNator!!!');
})

const server = async ()=>{

    try{
        connectDB(process.env.MONGODB_URL);//we aren't using compass cuz the database isn't gonna be stored locally but on cloud(atlas).
        app.listen(8080, ()=>{
        console.log("Application is running on port http://localhost:8080");
        })
    }catch(error){
        console.log(error)
    }


}

server();