import * as authService from './auth.service.js';

const setRefreshCookie = (res, token) => {
  res.cookie('refresh-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({ success: true, data: result });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
  
  setRefreshCookie(res, refreshToken);
  
  res.status(200).json({
    success: true,
    data: { user, accessToken },
  });
};

export const refresh = async (req, res) => {
  const token = req.cookies['refresh-token'];
  const { accessToken, refreshToken } = await authService.refreshAuthToken(token);
  
  setRefreshCookie(res, refreshToken);
  
  res.status(200).json({
    success: true,
    data: { accessToken },
  });
};

export const logout = async (req, res) => {
  const token = req.cookies['refresh-token'];
  await authService.logoutUser(token);
  
  res.clearCookie('refresh-token');
  res.status(200).json({ success: true, data: null });
};

export const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
};
