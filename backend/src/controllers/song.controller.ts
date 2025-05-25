import type { Request, Response, NextFunction } from "express";
import { songsModel } from "../models/song.model";
export const getAllSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const songs = await songsModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: songs,
      message: "Songs fetched successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const songs = await songsModel.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return res.status(200).json({
      message: "featured songs fetched succesfully",
      success: true,
      data: songs,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrendingSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const songs = await songsModel.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return res.status(200).json({
      message: "featured songs fetched succesfully",
      success: true,
      data: songs,
    });
  } catch (error) {
    next(error);
  }
};

export const getMadeForYouSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const songs = await songsModel.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return res.status(200).json({
      message: "featured songs fetched succesfully",
      success: true,
      data: songs,
    });
  } catch (error) {
    next(error);
  }
};
