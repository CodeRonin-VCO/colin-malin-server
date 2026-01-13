import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { validateFields } from "../middlewares/validationBody.middleware.js";
import { LOGIN_SCHEMA, REGISTER_SCHEMA, UPDATE_PASSWORD_SCHEMA } from "../schemas/auth.schema.js";


const authRouter = Router();

authRouter.post("/login", validateFields(LOGIN_SCHEMA), authController.login);
authRouter.post("/register", validateFields(REGISTER_SCHEMA), authController.register);
authRouter.put("/update-pwd", validateFields(UPDATE_PASSWORD_SCHEMA), authController.updatePwd);

export default authRouter;