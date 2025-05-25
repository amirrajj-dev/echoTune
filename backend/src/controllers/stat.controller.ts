import { NextFunction, Request, Response } from "express";
import { songsModel } from "../models/song.model";
import { usersModel } from "../models/user.model";
import { albumsModel } from "../models/album.model";

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [totalSongs, totalAlbums, totalUsers] = await Promise.all([
      songsModel.countDocuments(),
      albumsModel.countDocuments(),
      usersModel.countDocuments(),
    ]);
    const uniqueArtists = await songsModel.aggregate([
        {
            $unionWith : {
                coll: 'albums',
                pipeline: []
            }
        },
        {
            $group : {
                _id : "artists"
            }
        },
        {
            $count : "count"
        }
    ])
    return res.status(200).json({
        message : "Stats fetched successfully",
        success : true,
        data : {
            totalSongs,
            totalAlbums,
            totalUsers,
            uniqueArtists : uniqueArtists[0].count
        }
    })
  } catch (error) {
    next(error)
  }
};
