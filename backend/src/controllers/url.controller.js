import * as urlService from '../services/url.service.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customCode, expirationDate } = req.body;
    const userId = req.user?.id; // req.user may be undefined if we allow anonymous creation

    const url = await urlService.createShortUrl(originalUrl, customCode, expirationDate, userId);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.URL.CREATED,
      data: url,
    });
  } catch (error) {
    if (error.message === 'COLLISION') {
      return res.status(HTTP_STATUS.CONFLICT).json({ success: false, message: MESSAGES.URL.COLLISION });
    }
    next(error);
  }
};

export const listUrls = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const urls = await urlService.getUrlsByUser(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: urls,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUrl = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const updatedUrl = await urlService.updateUrl(id, userId, req.body);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.URL.UPDATED,
      data: updatedUrl,
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

export const deleteUrl = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await urlService.deleteUrl(id, userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.URL.DELETED,
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
