import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.GENERAL.VALIDATION_ERROR,
      errors: error.errors
    });
  }
};
