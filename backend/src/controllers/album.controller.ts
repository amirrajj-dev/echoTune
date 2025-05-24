import type { Request, Response, NextFunction } from "express";
import { albumsModel } from "../models/album.model";
export const getAlbums = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const albums = await albumsModel.find();
    res.status(200).json({
      success: true,
      data: albums,
      message: "Albums fetched successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try{
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Album ID is required",
            });
        }
        const album = await albumsModel.findById(id).populate('songs');
        if (!album) {
            return res.status(404).json({
                success: false,
                message: "Album not found",
            });
        }
        res.status(200).json({
            success: true,
            data: album,
            message: "Album fetched successfully",
        });
    }catch(err) {
        next(err);
    }
};
