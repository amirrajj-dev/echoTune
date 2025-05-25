import express from 'express'
import {getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs} from '../controllers/song.controller'
import { protectRoute, requireAdmin } from '../middlewares/auth.middleware';

const router = express.Router()

router.get('/', protectRoute as express.RequestHandler , requireAdmin as express.RequestHandler , getAllSongs)
router.get('/featured', getFeaturedSongs as express.RequestHandler)
router.get('/trending', getTrendingSongs as express.RequestHandler)
router.get('/made-for-you', getMadeForYouSongs as express.RequestHandler)

export default router;