import { chatController } from "@/v1/chat/controllers/chat";
import { authenticate } from "@/v1/chat/middlewares/auth";
import express from "express";

const chatRouter = express.Router();

chatRouter.get("/", authenticate(), chatController);

export { chatRouter };
