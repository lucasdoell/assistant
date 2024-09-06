import { loginHandler } from "@/v1/auth/controllers/login-handler";
import { logoutHandler } from "@/v1/auth/controllers/logout-handler";
import { signupHandler } from "@/v1/auth/controllers/signup-handler";
import { userHandler } from "@/v1/auth/controllers/user-handler";
import { validate } from "@/v1/auth/middlewares/validate";
import { loginSchema } from "@/v1/auth/validation/login";
import { signupSchema } from "@/v1/auth/validation/signup";
import express from "express";

const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signupHandler);
authRouter.post("/login", validate(loginSchema), loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.get("/user", userHandler);

export { authRouter };
