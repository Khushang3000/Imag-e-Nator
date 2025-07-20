import express from "express";
import * as dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";//see docs and you can get your env variables from the view api keys button there on the getting started page.
//whenever you change the .env then you have to re-run the server.

import Post from "../mongodb/models/post.js";

dotenv.config(); //to make .env variables available here ofc.

const router = express.Router();//creating a new instance of router.

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
})


// GET ALL POSTS
router.route('/').get(async (req,res) =>{
    try {
        const posts = await Post.find({});//all posts!
        res.status(200).json({success:true, data: posts})
    } catch (error) {
        res.status(500).json({success:false, message: error})
        
    }
})

// CREATE A POST
router.route('/').post(async (req,res) =>{
        try {
        const {name, prompt, photo} = req.body;
        const photoUrl = await cloudinary.uploader.upload(photo);

        const newPost = await Post.create({//creating an actual object inside Post(which is Schema)
         name,
         prompt,
         photo: photoUrl.url,
        })

        res.status(201).json({success: true, data: newPost});//don't you think it'd be a good idea to wrap this in a try-catch block?PS: yeah!
        } catch (error) {
            res.status(500).json({success: false, message:error})
        }
    })//we could have stored our images in the base64 url and stored the images locally, but as we scale we need to store our images somewhere, that's why we first use cloudinary to store the image first, and only then
    //create the actual instance(newPost) with refering photoUrl.url which is based on photoUrl which we get from cloudinary.

export default router;