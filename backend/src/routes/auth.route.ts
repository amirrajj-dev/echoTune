import express, { Response, Request } from "express";
import { usersModel } from "../models/user.model";
import { authCallback } from "../controllers/auth.controller";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

router.post("/callback", catchAsync(authCallback));

export default router;
