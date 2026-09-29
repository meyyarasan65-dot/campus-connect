import { User } from '../../models/User.js';
import { RefreshToken } from '../../models/RefreshToken.js';
import { ApiError } from '../../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken, hashRefreshToken } from '../../utils/tokens.js';

export const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(409, 'Email already in use');
  }

  const user = await User.create(userData);
  
  // Create profile stub here if needed, or handle via events
  return { user: { _id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(401, 'Account has been deactivated');
  }

  const accessToken = generateAccessToken(user);
  const { token: refreshTokenText, hash, expiresAt } = generateRefreshToken();

  await RefreshToken.create({
    user: user._id,
    tokenHash: hash,
    expiresAt,
  });

  return {
    user: { _id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
    accessToken,
    refreshToken: refreshTokenText,
  };
};

export const refreshAuthToken = async (refreshTokenText) => {
  if (!refreshTokenText) {
    throw new ApiError(401, 'Refresh token required');
  }

  const hash = hashRefreshToken(refreshTokenText);
  const tokenDoc = await RefreshToken.findOne({ tokenHash: hash }).populate('user');

  if (!tokenDoc) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  if (tokenDoc.revoked || tokenDoc.expiresAt < new Date()) {
    // If revoked, might be a reuse attack. We could revoke ALL tokens for this user.
    await RefreshToken.updateMany({ user: tokenDoc.user._id }, { revoked: true });
    throw new ApiError(401, 'Token expired or revoked. Please login again.');
  }

  // Rotate token
  tokenDoc.revoked = true;
  
  const { token: newRefreshTokenText, hash: newHash, expiresAt } = generateRefreshToken();
  tokenDoc.replacedByToken = newHash;
  await tokenDoc.save();

  await RefreshToken.create({
    user: tokenDoc.user._id,
    tokenHash: newHash,
    expiresAt,
  });

  const newAccessToken = generateAccessToken(tokenDoc.user);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshTokenText,
  };
};

export const logoutUser = async (refreshTokenText) => {
  if (!refreshTokenText) return;
  const hash = hashRefreshToken(refreshTokenText);
  await RefreshToken.findOneAndUpdate({ tokenHash: hash }, { revoked: true });
};
