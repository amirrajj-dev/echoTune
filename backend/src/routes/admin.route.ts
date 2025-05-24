import express from 'express'
import { creatSong, deleteSong , createAlbum , deleteAlbum , checkAdmin } from '../controllers/admin.controller';
import { protectRoute, requireAdmin } from '../middlewares/auth.middleware';
import { catchAsync } from "../utils/catchAsync";

const router = express.Router()

router.use(protectRoute as express.RequestHandler , requireAdmin as express.RequestHandler);

router.post('/songs' , creatSong as express.RequestHandler);
router.delete('/songs/:id' , deleteSong as express.RequestHandler);
router.post('/albums' , createAlbum as express.RequestHandler);
router.post('/albums/:id', deleteAlbum as express.RequestHandler);

router.get('/check-admin'  , catchAsync(checkAdmin));

export default router;