import express from "express";
import * as dotenv from "dotenv";
import OpenAIApi from "openai";



dotenv.config(); //to make .env variables available here ofc.

const router = express.Router();//creating a new instance of router.


//this way was depricated 
// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY
// }
// )
// const openai = new OpenAIApi(configuration);

//from v4 we can use this version, it's also okay if we DON'T pass the apiKey, i.e just do new OpenAIApi(); and it'll automatically look for "OPENAI_API_KEY"(make sure that this is the variable's name) in the .env.
//that's there on their official documentation, but you can checkout and read through this github repo "https://github.com/openai/openai-node?tab=readme-ov-file"
const openai = new OpenAIApi({
    apiKey:process.env['OPENAI_API_KEY'],//to get apiKey-->openai.com login--> start building (fill the forms) or if already filled then click your profile icon-->your profile-->and then on the left navbar click on api keys.
})


router.route('/').get((req,res)=>{
    res.send("Hello from Imaginator!!!")
})

router.route('/').post(async (req,res)=>{
    //this is an api call and hence async
    try {

        // throw new Error("this is a manual error to see the error object's json format");

        const {prompt} = req.body;
        //for image generation guide,go to docs-->images and vision -->overview -->createImages first of all don't look at the responses api(it's just like chatgpt) but click on the imageAPI on the docs.
        const aiResponse = await openai.images.generate({
            prompt,
            n:1,
            size: '1024x1024',
            response_format: 'b64_json'
            //response_format: 'url'  is default
        }
        );

        
        const image = aiResponse.data[0].b64_json;
        //if we used the older openai sdk i.e version 3.0 that uses createImage which returns axios style response so response shape there would be- res.data.data[0]
        //but we're using sdk v4.0 and here openai.images.generate returns raw response so the response shape is- res.data[0]

        res.status(200).json({photo: image});//attaching image to response and sending response back to the frontend.(.json sends the response)
        
    } catch (error) {
        console.error("Caught Error:", error);//just to know the error object structure, we can also explicitly send an error in the try block like
        // throw new Error("this is a manual error to see the error object's json format");
        //we first need to make a POST req through the frontend first tho.
        //then we can decide how to send error message below according to the folder structure.
        res.status(500).send(error?.response.data.error.message)


    }
})
//now we just need to connect our frontend to the backend. btw in our pages,  handleSubmit and generateImg are the funcitons that will call backend.
export default router;