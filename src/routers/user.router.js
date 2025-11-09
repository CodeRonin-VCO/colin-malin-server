import { Router } from "express";
import userController from "../controllers/user.controller.js";


const userRouter = Router();

userRouter.route("/")
    .get(userController.getUser)
    .put(userController.modifyUser)
    .delete(userController.deleteUser)

export default userRouter;