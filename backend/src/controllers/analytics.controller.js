import * as analyticsService from '../services/analytics.service.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await analyticsService.getAnalyticsForUrl(id, userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data
    });
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.URL.NOT_FOUND });
    }
    if (error.message === 'UNAUTHORIZED') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTH.UNAUTHORIZED });
    }
    next(error);
  }
};
