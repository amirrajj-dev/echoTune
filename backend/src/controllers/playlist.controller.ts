import { usersModel } from "../models/user.model";
import { playlistsModel } from "../models/playlist.model";
import { songsModel } from "../models/song.model";
import { NextFunction, Request, Response } from "express";

export const createPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Name is required",
        success: false,
      });
    }
    if (name.length < 4) {
      return res.status(400).json({
        message: "Name must be at least 4 characters long",
        success: false,
      });
    }
    const user = await usersModel.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }
    const playlist = await playlistsModel.create({ name, owner: user._id });
    await usersModel.findOneAndUpdate(
      { clerkId: userId },
      { $push: { playLists: playlist._id } }
    );
    return res.status(201).json({
      message: "Playlist Created Successfully",
      success: true,
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
};
export const getUserPlaylists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId;
    const user = await usersModel
  .findOne({ clerkId: userId })
  .populate({
    path: "playLists",
    select: "name _id",
    populate: {
      path: "songs",
      select: "title _id",
    },
  });
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Playlists Fetched Successfully",
      success: true,
      data: user.playLists,
    });
  } catch (error) {
    next(error);
  }
};
export const getPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;
    const currentUser = await usersModel.findOne({ clerkId: userId });
    if (!id) {
      return res.status(400).json({
        message: "Playlist Id is required",
        success: false,
      });
    }
    const playlist = await playlistsModel
      .findById(id)
      .populate("owner")
      .populate("songs");
    if (!playlist) {
      return res.status(404).json({
        message: "Playlist Not Found",
        success: false,
      });
    }
    if (currentUser._id.toString() !== playlist.owner._id.toString()) {
      return res.status(403).json({
        message: "You are not the owner of this playlist",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Playlist Fetched Successfully",
      success: true,
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
};
export const updatePlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { songId, name: newNameForPlaylist } = req.body;
    const userId = req.auth.userId;

    if (!id) {
      return res.status(400).json({
        message: "Invalid playlist ID",
        success: false,
      });
    }

    const user = await usersModel.findOne({ clerkId: userId });
    const playlist = await playlistsModel.findById(id).populate("songs");

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
        success: false,
      });
    }
    if (user._id.toString() !== playlist.owner.toString()) {
      return res.status(403).json({
        message: "You are not the owner of this playlist",
        success: false,
      });
    }

    let updated = false;

    if (
      songId?.trim().length > 0
    ) {
      const song = await songsModel.findById(songId);
      if (!song) {
        return res.status(404).json({
          message: "Song not found",
          success: false,
        });
      }
      if (playlist.songs.some((p: any)=>p.title === song.title)) {
        playlist.songs = playlist.songs.filter((p : any) => p.title !== song.title);
        updated = true;
      } else {
        playlist.songs.push(songId);
        updated = true;
      }
    }

    if (
      newNameForPlaylist &&
      newNameForPlaylist.trim().length >= 4 &&
      newNameForPlaylist.trim().length <= 100
    ) {
      playlist.name = newNameForPlaylist.trim();
      updated = true;
    }

    if (!updated) {
      return res.status(400).json({
        message: "No valid updates provided",
        success: false,
      });
    }

    await playlist.save();

    return res.status(200).json({
      message: "Playlist updated successfully",
      success: true,
      data: playlist,
    });
  } catch (error) {
    next(error);
  }
};
export const deletePlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Playlist Id is required",
        success: false,
      });
    }
    const userId = req.auth.userId;
    const currentUser = await usersModel.findOne({ clerkId: userId });
    const playList = await playlistsModel.findById(id).populate("owner");
    if (!playList) {
      return res.status(404).json({
        message: "Playlist Not Found",
        success: false,
      });
    }
    if (currentUser._id.toString() !== playList.owner._id.toString()) {
      return res.status(403).json({
        message: "You are not the owner of this playlist",
        success: false,
      });
    }
    await usersModel.findOneAndUpdate(
      { clerkId: userId },
      { $pull: { playlists: id } }
    );
    await playlistsModel.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Playlist Deleted Successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
