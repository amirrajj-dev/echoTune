import express from 'express'
import { protectRoute, requireAdmin } from '../middlewares/auth.middleware';
import { getStats } from '../controllers/stat.controller';

const router = express.Router()

router.get('/' , protectRoute as express.RequestHandler , requireAdmin as express.RequestHandler , getStats as express.RequestHandler);

export default router;