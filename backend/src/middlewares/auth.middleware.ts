import { clerkClient } from "@clerk/express";
import { Request, Response } from "express";

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
  if (!req.auth.userId) {
    return res.status(401).json({ message: "Unauthorized you are not logged in" , success : false });
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