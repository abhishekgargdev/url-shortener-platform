import express from 'express';
import { API_ROUTES } from '../constants/routes.js';
import authRoutes from './auth.routes.js';
import urlRoutes from './url.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = express.Router();

router.use(API_ROUTES.AUTH.LOGIN.replace('/login', ''), authRoutes);
router.use(API_ROUTES.URL.CREATE.replace('/create', ''), urlRoutes);
router.use(API_ROUTES.ANALYTICS.GET_BY_URL.replace('/:id', ''), analyticsRoutes);

export default router;
