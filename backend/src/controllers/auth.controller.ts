import type { NextFunction, Request, Response } from "express";
import { usersModel } from "../models/user.model";

export const authCallback = async (
  req: Request,
  res: Response,
  next : NextFunction
) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    const user = await usersModel.findOne({ clerkId: id });

    if (!user) {
      const newUser = await usersModel.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      });

      return res.status(201).json({
        message: "User created successfully",
        data: newUser,
      });
    }

    return res.status(200).json({
      message: "User already exists",
      success: true,
    });
  } catch (error) {
   next(error);
  }
};
