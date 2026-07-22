import { Router } from "express";

import { register, login } from "./auth.controller";
import { 
    registerSchema,
    loginSchema

 } from "./auth.validation";
import { validate } from "../../middleware/validate";

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

export default router;