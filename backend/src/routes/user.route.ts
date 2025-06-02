import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware';
import { addToFavouriteSongs, getFavouriteSongs, getMessages, getUsers } from '../controllers/user.controller';

const router = express.Router()

router.get('/' , protectRoute as express.RequestHandler , getUsers as express.RequestHandler)
router.put('/favourites/:songId', protectRoute as express.RequestHandler, addToFavouriteSongs as express.RequestHandler);
router.get('/messages/:id' , protectRoute as express.RequestHandler , getMessages as express.RequestHandler);
router.get('/favourites' , protectRoute as express.RequestHandler , getFavouriteSongs as express.RequestHandler);

export default router;