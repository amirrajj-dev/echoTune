import mongoose from "mongoose";

const schema = new mongoose.Schema({
    fullName : {
        type: String,
        required: true
    },
    imageUrl : {
        type: String,
        required: true
    },
    clerkId : {
        type: String,
        required: true,
        unique: true
    },
    favouriteSongs : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "song",
            required: false,
            default: []
        }
    ]
},{
    timestamps: true
})

export const usersModel = mongoose.models.user || mongoose.model("user", schema);