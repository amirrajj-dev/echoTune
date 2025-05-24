import mongoose from "mongoose";

export const connectToDb = async ()=>{
    try {
        if (mongoose.connections[0].readyState){
            console.log('Already Connected To The Db 🎵💙');
            return;
        }
        await mongoose.connect(process.env.MONGO_URI as string).then(()=>{
            console.log('Connected To The Db Successfully 🎵💙');
        }) 
    } catch (error) {
        console.error('Error connecting to the database => ', error);
        process.exit(1);
    }
}