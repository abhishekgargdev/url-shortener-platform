import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import prisma from '../config/prisma.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true }
      });

      if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTH.UNAUTHORIZED });
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
         return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTH.TOKEN_EXPIRED });
      }
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTH.UNAUTHORIZED });
    }
  }

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTH.UNAUTHORIZED });
  }
};
