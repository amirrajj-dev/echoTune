import express from 'express'
import { getAlbums , getAlbum } from '../controllers/album.controller'

const router = express.Router()

router.get('/' , getAlbums as express.RequestHandler)
router.get('/:id' , getAlbum as express.RequestHandler)

export default router;