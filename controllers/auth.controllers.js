import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const createAppError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sendAuthResponse = (user, statusCode, message, res) => {
  const token = signToken(user._id);

  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  delete safeUser.passwordResetToken;
  delete safeUser.passwordResetExpires;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      user: safeUser,
    },
  });
};

/**
 * 1.Register
 *POST /mba/api/v1/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        createAppError("An account with this email already exists", 409),
      );
    }

    const user = User.create({
      name,
      email,
      password,
      role: "customer",
    });

    sendAuthResponse(user, 201, "Account registered successfully", res);
  } catch (error) {
    next(error);
  }
};

//2.Login
// POST /mba/api/v1/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(createAppError("Invalid email or password", 401));
    }

    sendAuthResponse(user, 200, "Logged in successfully", res);
  } catch (error) {
    next(error);
  }
};

//3.Get my user details
// GET /mba/api/v1/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createAppError("User not found", 404));
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

//4.Update Password
// PATCH /api/v1/auth/update-password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return next(createAppError("User not found", 404));
    }

    const isMatch = await user.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return next(createAppError("Current password is incorrect", 401));
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date(Date.now() - 1000);
    await user.save();

    sendAuthResponse(user, 200, "Password updated successfully", res);
  } catch (error) {
    next(error);
  }
};

//Forgot password
// POST /api/v1/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createAppError("No user found with that email address", 404));
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Password reset token generated",
      data: {
        resetToken,
        expiresIn: "10 minutes",
      },
    });
  } catch (error) {
    next(error);
  }
};

//Reset Password
// PATCH /api/v1/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(createAppError("Reset token is invalid or has expired", 400));
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = new Date(Date.now() - 1000);
    await user.save();

    sendAuthResponse(user, 200, "Password reset successful", res);
  } catch (error) {
    next(error);
  }
};
