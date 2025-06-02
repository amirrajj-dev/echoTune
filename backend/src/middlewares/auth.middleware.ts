import { clerkClient , getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { usersModel } from "../models/user.model";

declare global {
  namespace Express {
    export interface Request {
        auth: {
            userId?: string;
        };
    }
  }
}
export const protectRoute = async (req: Request, res: Response, next: any) => {
  console.log('userId => ' , req.auth.userId);
  const {userId} = getAuth(req)
  console.log('userId => ' , userId);
  if (!req.auth.userId){
    return res.status(401).json({ message: "Unauthorized you are not logged in" });
  }
  next();
};

export const requireAdmin = async (req: Request, res: Response, next: any) => {
    try {
        const currentUser = await clerkClient.users.getUser(req.auth.userId as string);
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress
        if (!isAdmin) {
            return res.status(403).json({ message: "Forbidden you are not an admin", success: false });
        }
        next()
    } catch (error) {
        next(error)
    }
}