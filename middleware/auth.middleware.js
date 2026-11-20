import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const createAppError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const protect = async (req, res, next) => {
  const authorization = req.get("authorization");
  const bearerMatch = authorization?.match(/^Bearer\s+(.+)$/i);

  if (!bearerMatch) {
    return next(
      createAppError("You are not logged in. Please provide a Bearer token.", 401),
    );
  }

  if (!process.env.JWT_SECRET) {
    return next(createAppError("JWT_SECRET is not configured", 500));
  }

  let decoded;
  try {
    decoded = jwt.verify(bearerMatch[1], process.env.JWT_SECRET);
  } catch {
    return next(createAppError("Invalid or expired token", 401));
  }

  if (!decoded || typeof decoded !== "object" || !decoded.id) {
    return next(createAppError("Invalid or expired token", 401));
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        createAppError("The user belonging to this token no longer exists", 401),
      );
    }

    if (
      user.passwordChangedAt &&
      typeof decoded.iat === "number" &&
      user.passwordChangedAt.getTime() / 1000 > decoded.iat
    ) {
      return next(
        createAppError(
          "Password was changed after this token was issued. Please log in again.",
          401,
        ),
      );
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const restrictTo = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.roles)) {
    return next(
      createAppError("You do not have permission to perform this action", 403),
    );
  }

  return next();
};
