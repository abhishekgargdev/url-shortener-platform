import express from 'express';
import { createUrl, listUrls, updateUrl, deleteUrl } from '../controllers/url.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createUrlSchema, updateUrlSchema } from '../validations/url.validation.js';
import { shortUrlLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// Allow public access to createUrl if you want, or protect it
// Here we apply protect optionally or let the controller handle it if req.user is absent
// But according to the plan, we should allow creating URLs, let's just protect it normally
// Wait, usually URL shorteners allow public creation. We'll use a custom middleware that sets req.user if token exists, else unauthenticated.
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) return next();
  protect(req, res, next);
};

router.post('/create', shortUrlLimiter, optionalAuth, validate(createUrlSchema), createUrl);
router.get('/list', protect, listUrls);
router.put('/:id', protect, validate(updateUrlSchema), updateUrl);
router.delete('/:id', protect, deleteUrl);

export default router;
