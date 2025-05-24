import type{ Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  res.status(err.status || 500).json({
    message: err instanceof Error ? err.message : "Internal Server Error",
    success: false,
  });
};

export default errorMiddleware;