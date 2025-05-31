import { NextFunction, Request, Response } from "express";
import { songsModel } from "../models/song.model";
import { albumsModel } from "../models/album.model";
import { uploadToCloudinary } from "../utils/upload";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary";

export const creatSong = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res
        .status(400)
        .json({ message: "Audio file and image file are required." });
    }
    const { title, albumId, duration, artist } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;
    if (!title || !albumId || !duration || !artist) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const audioUpload = await uploadToCloudinary(audioFile);
    const imageUpload = await uploadToCloudinary(imageFile);

    const song = new songsModel({
      title,
      duration,
      artist,
      imageUrl: imageUpload.secure_url,
      imagePublicId: imageUpload.public_id,
      audioUrl: audioUpload.secure_url,
      audioPublicId: audioUpload.public_id,
      albumId: albumId || null,
    });
    await song.save();
    if (albumId) {
      await albumsModel.findByIdAndUpdate(
        albumId,
        {
          $push: { songs: song._id },
        },
        { new: true }
      );
    }
    return res.status(201).json({
      message: "Song created successfully",
      data: song,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSong = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Song ID is required." });
    }
    const song = await songsModel.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found." });
    }
    if (song.albumId) {
      await albumsModel.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }
    if (song.audioPublicId) await deleteFromCloudinary(song.audioPublicId , 'video');
    if (song.imagePublicId) await deleteFromCloudinary(song.imagePublicId , 'image');
    await songsModel.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Song deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};


export const createAlbum = async (req : Request , res : Response , next : NextFunction)=>{
    try{
        const {title , artist , releaseYear} = req.body
        const imageFile = req.files?.imageFile;
        if(!title || !artist || !releaseYear){
            return res.status(400).json({message : "All fields are required."})
        }
        if(!imageFile){
            return res.status(400).json({message : "Image file is required."})
        }
        const imageUpload = await uploadToCloudinary(imageFile);
        const album = new albumsModel({
            title,
            artist,
            releaseYear,
            imageUrl: imageUpload.secure_url,
            imagePublicId: imageUpload.public_id
        });

        await album.save();
        return res.status(201).json({
            message: "Album created successfully",
            data: album,
            success: true
        });

    }catch(error){
        next(error);
    }
}

export const deleteAlbum = async (req : Request , res : Response , next : NextFunction)=>{
    try{
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Album ID is required." });
        }
        const album = await albumsModel.findById(id);
        if (!album) {
            return res.status(404).json({ message: "Album not found." });
        }
        if (album.imagePublicId) await deleteFromCloudinary(album.imagePublicId , 'image');
        await albumsModel.findByIdAndDelete(id);
        if (album.songs.length > 0) {
          // delelte songs audio and image from cloudinary
          for (const song of album.songs) {
            if (song.audioPublicId) await deleteFromCloudinary(song.audioPublicId , 'video');
            if (song.imagePublicId) await deleteFromCloudinary(song.imagePublicId , 'image');
          }
        }
        // Delete all songs associated with this album
        await songsModel.deleteMany({ albumId: id });
        return res.status(200).json({
            message: "Album deleted successfully",
            success: true,
        });
    }catch(error){
        next(error);
    }
}

export const checkAdmin = async (req : Request , res : Response , next : NextFunction)=>{
  return res.status(200).json({
    message: "You are an admin",
    success: true
  })
}