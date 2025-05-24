import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    artist : {
        type: String,
        required: true
    },
    imageUrl : {
        type: String,
        required: true
    },
    imagePublicId : {
        type: String,
        required: true // This is the public ID of the image in Cloudinary used for deletion
    },
    releaseYear : {
        type: Number,
        required: true
    },
    songs : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "song",
            required: true
        }
    ]
},{
    timestamps: true
})

export const albumsModel = mongoose.models.album || mongoose.model("album", schema);