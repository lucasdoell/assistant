import { loginHandler } from "@/v1/auth/controllers/login-handler";
import { logoutHandler } from "@/v1/auth/controllers/logout-handler";
import { meHandler } from "@/v1/auth/controllers/me-handler";
import { signupHandler } from "@/v1/auth/controllers/signup-handler";
import { validate } from "@/v1/auth/middlewares/validate";
import { loginSchema } from "@/v1/auth/validation/login";
import { signupSchema } from "@/v1/auth/validation/signup";
import express from "express";

const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signupHandler);
authRouter.post("/login", validate(loginSchema), loginHandler);
authRouter.get("/logout", logoutHandler);
authRouter.get("/me", meHandler);

export { authRouter };
