import express from "express";
import {
  deleteAccount,
  forgotPassword,
  getMe,
  login,
  register,
  resetPassword,
  updatePassword,
} from "../controllers/auth.controllers.js";
import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} from "../validators/auth.validator.js";

const router = express.Router();
const basePath = "/mba/api/v1/auth";

router.post(`${basePath}/register`, validate(registerSchema), register);
router.post(`${basePath}/login`, validate(loginSchema), login);
router.get(`${basePath}/me`, protect, getMe);
router.patch(
  `${basePath}/update-password`,
  protect,
  validate(updatePasswordSchema),
  updatePassword,
);
router.post(`${basePath}/forgot-password`, validate(forgotPasswordSchema), forgotPassword);
router.patch(
  `${basePath}/reset-password/:token`,
  validate(resetPasswordSchema),
  resetPassword,
);
router.delete(`${basePath}/delete-account`, protect, deleteAccount);

export default router;
