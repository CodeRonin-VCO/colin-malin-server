import { Router } from "express";
import userController from "../controllers/user.controller.js";


const userRouter = Router();

userRouter.route("/")
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.removeUser)

export default userRouter;