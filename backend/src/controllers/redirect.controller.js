import * as redirectService from '../services/redirect.service.js';
import { MESSAGES } from '../constants/messages.js';

export const handleRedirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const url = await redirectService.getUrlForRedirect(shortCode);

    // Track click asynchronously without awaiting
    redirectService.trackClick(url.id, req);

    res.redirect(301, url.originalUrl);
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).send(MESSAGES.URL.NOT_FOUND);
    }
    if (error.message === 'EXPIRED') {
      return res.status(410).send(MESSAGES.URL.EXPIRED);
    }
    next(error);
  }
};
