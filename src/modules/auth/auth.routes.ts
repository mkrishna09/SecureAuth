import { Router } from "express";

import {
  register,
  login,
  me,
  refresh,
  forgotPassword,
  resetPassword,
} from "./auth.controller";

import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation";
import { authorize } from "../../middleware/authorize";
import { logout } from "./auth.controller";
import { logoutAll} from "./auth.controller";
import { loginRateLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    register
);

router.post(
  "/login",
  loginRateLimiter,
  validate(loginSchema),
  login
);

router.post(
  "/refresh",
  refresh
);

router.post(
  "/logout",
  logout
);

router.post(
  "/logout-all",
  authenticate,
  logoutAll
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPassword
);

router.get(
  "/me",
  authenticate,
  me
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPassword
);

router.get(
    "/admin",
    authenticate,
    authorize("ADMIN"),
    (_req, res) => {
        res.json({
            success: true,
            message: "Welcome Admin!"
        });
    }
);

export default router;