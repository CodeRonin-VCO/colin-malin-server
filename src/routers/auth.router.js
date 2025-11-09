import { Router } from "express";
import authController from "../controllers/auth.controller.js";


const authRouter = Router();

authRouter.route("/login").post(authController.login);
authRouter.route("/register").post(authController.register);
authRouter.route("/update-pwd").post(authController.updatePwd);

export default authRouter;