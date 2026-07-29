import { Router } from "express";

import {
  register,
  login,
  me,
  refresh,
} from "./auth.controller";

import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation";
import { authorize } from "../../middleware/authorize";
import { logout } from "./auth.controller";

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    register
);

router.post(
  "/login",
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

router.get(
  "/me",
  authenticate,
  me
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