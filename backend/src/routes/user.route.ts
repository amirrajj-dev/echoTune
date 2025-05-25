import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware';
import { addSongToFavouriteSongs, getUsers } from '../controllers/user.controller';

const router = express.Router()

router.get('/' , protectRoute as express.RequestHandler , getUsers as express.RequestHandler)
router.put('/favorites/:songId', protectRoute as express.RequestHandler, addSongToFavouriteSongs as express.RequestHandler);


export default router;