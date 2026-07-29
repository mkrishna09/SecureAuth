import { Router } from "express";

import { register, login } from "./auth.controller";
import { 
    registerSchema,
    loginSchema

 } from "./auth.validation";
import { validate } from "../../middleware/validate";

import { me } from "./auth.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

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