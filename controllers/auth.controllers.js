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

//1.Register
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

/**  
//2.Login
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
export const getMe = async (req, res , next) => {
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
    next(error)
  }
};

//4.Update Password
export const updatePassword = async ( req , res , next ) => {
    try {

        
    } catch (error) {
        
    }
}
*/