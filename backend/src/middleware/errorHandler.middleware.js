import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.GENERAL.VALIDATION_ERROR,
      errors: err.errors
    });
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'Unique constraint failed'
      });
    }
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: MESSAGES.GENERAL.SERVER_ERROR
  });
};
