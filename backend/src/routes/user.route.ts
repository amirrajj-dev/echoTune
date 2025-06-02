import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware';
import { addSongToFavouriteSongs, getMessages, getUsers } from '../controllers/user.controller';

const router = express.Router()

router.get('/' , protectRoute as express.RequestHandler , getUsers as express.RequestHandler)
router.put('/favorites/:songId', protectRoute as express.RequestHandler, addSongToFavouriteSongs as express.RequestHandler);
router.get('/messages/:id' , protectRoute as express.RequestHandler , getMessages as express.RequestHandler);

export default router;