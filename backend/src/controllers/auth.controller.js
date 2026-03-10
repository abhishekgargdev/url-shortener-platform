import * as authService from '../services/auth.service.js';
import { generateToken } from '../utils/jwt.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.registerUser(email, password);
    const token = generateToken(user.id);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.AUTH.REGISTER_SUCCESS,
      data: {
        user: { id: user.id, email: user.email },
        token,
      },
    });
  } catch (error) {
    if (error.message === 'USER_EXISTS') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: MESSAGES.AUTH.USER_EXISTS });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    const token = generateToken(user.id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      data: {
        user: { id: user.id, email: user.email },
        token,
      },
    });
  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTH.INVALID_CREDENTIALS });
    }
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: MESSAGES.AUTH.UNAUTHORIZED });
    }
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
