import express from "express";
import { createPlaylist, getUserPlaylists, getPlaylist, updatePlaylist, deletePlaylist } from "../controllers/playlist.controller";
import { protectRoute } from "../middlewares/auth.middleware";
const router = express.Router();

router.post("/",  protectRoute as express.RequestHandler, createPlaylist as express.RequestHandler);
router.get("/",  protectRoute as express.RequestHandler, getUserPlaylists as express.RequestHandler);
router.get("/:id",  protectRoute as express.RequestHandler, getPlaylist as express.RequestHandler);
router.put("/:id",  protectRoute as express.RequestHandler, updatePlaylist as express.RequestHandler);
router.delete("/:id",  protectRoute as express.RequestHandler, deletePlaylist as express.RequestHandler);

export default router;