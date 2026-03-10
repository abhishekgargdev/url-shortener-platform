import express from 'express';
import { handleRedirect } from '../controllers/redirect.controller.js';
import { REDIRECT_ROUTE } from '../constants/routes.js';

const router = express.Router();

router.get(REDIRECT_ROUTE, handleRedirect);

export default router;
