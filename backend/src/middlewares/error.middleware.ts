import type{ Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? "Internal Server Error" : err instanceof Error ? err.message : "An error occurred",
    success: false,
  });
};

export default errorMiddleware;