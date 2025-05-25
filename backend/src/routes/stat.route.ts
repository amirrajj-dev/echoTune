import express from 'express'
import { protectRoute, requireAdmin } from '../middlewares/auth.middleware';

const router = express.Router()

router.get('/' , protectRoute as express.RequestHandler , requireAdmin as express.RequestHandler);

export default router;