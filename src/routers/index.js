import { Router } from "express";
import authRouter from "./auth.router.js";
import userRouter from "./user.router.js";
import gamesRouter from "./games.router.js";
import { authentificationMiddleware, authorizedMiddleware } from "../middlewares/auth.middleware.js";
import questionsRouter from "./questions.router.js";
import scoresRouter from "./scores.router.js";


const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", authentificationMiddleware(), authorizedMiddleware(), userRouter);
apiRouter.use("/questions", authentificationMiddleware(), authorizedMiddleware(), questionsRouter);
apiRouter.use("/games", authentificationMiddleware(), authorizedMiddleware(), gamesRouter);
apiRouter.use("/scores", authentificationMiddleware(), authorizedMiddleware(), scoresRouter);

export default apiRouter;