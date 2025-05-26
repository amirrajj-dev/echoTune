import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    imageUrl : {
        type: String,
        required: true
    },
    artist : {
        type: String,
        required: true
    },
    audioUrl : {
        type: String,
        required: true
    },
    duration : {
        type: Number,
        required: true
    },
    albumId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "album",
        required: false
    },
    imagePublicId : {
        type: String,
        required: true // this field gets used when we want to delete a song assets like audio and image from cloudinary
    },
    audioPublicId : {
        type: String,
        required: true // this field gets used when we want to delete a song assets like audio and image from cloudinary
    }
},{
    timestamps: true
})

export const songsModel = mongoose.models.song || mongoose.model("song", schema);