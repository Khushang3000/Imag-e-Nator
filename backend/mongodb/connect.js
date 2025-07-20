import mongoose from "mongoose";


export const connectDB = (url)=>{
    mongoose.set('strictQuery', true)//useful when working with search functionality.
    // as it Only allows filtering/querying by fields that are actually in your schema.

    mongoose.connect(url)
    .then(()=>{console.log("MongoDB connected!!!")})
    .catch((err)=>{console.log(err)});
}