import mongoose from "mongoose";

const schema = new mongoose.Schema({
    senderId : {
        type : String,
        required: true
    },
    receiverId : {
        type : String,
        required: true
    },
    content : {
        type : String,
        required: true
    }
},{
    timestamps: true
})

export const messagesModel = mongoose.models.message || mongoose.model("message", schema);