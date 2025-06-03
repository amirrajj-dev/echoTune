import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "song",
        required: false,
        default: [],
      },
    ]
  },
  {
    timestamps: true,
  }
);

export const playlistsModel = mongoose.models.playlist || mongoose.model("playlist", playlistSchema);