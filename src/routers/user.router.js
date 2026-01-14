import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { validateFields } from "../middlewares/validationBody.middleware.js";


const userRouter = Router();

userRouter.route("/")
    .get(userController.getUser)
    .put(validateFields(UPDATE_USER_SCHEMA), userController.updateUser)
    .delete(userController.removeUser)

export default userRouter;