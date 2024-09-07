import { loginHandler } from "@/v0/auth/controllers/login-handler";
import { logoutHandler } from "@/v0/auth/controllers/logout-handler";
import { signupHandler } from "@/v0/auth/controllers/signup-handler";
import { userHandler } from "@/v0/auth/controllers/user-handler";
import { validate } from "@/v0/auth/middlewares/validate";
import { loginSchema } from "@/v0/auth/validation/login";
import { signupSchema } from "@/v0/auth/validation/signup";
import express from "express";

const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signupHandler);
authRouter.post("/login", validate(loginSchema), loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.get("/user", userHandler);

export { authRouter };
