import rateLimit from 'express-rate-limit';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: MESSAGES.GENERAL.TOO_MANY_REQUESTS
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS
});

export const shortUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 short URL creations per hour
  message: {
    success: false,
    message: MESSAGES.GENERAL.TOO_MANY_REQUESTS
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS
});
