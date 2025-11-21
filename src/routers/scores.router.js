import { Router } from "express";
import scoresController from "../controllers/scores.controller.js";


const scoresRouter = Router();

scoresRouter.route("/")
    .get(scoresController.filtered)
    .post(scoresController.addResults);

scoresRouter.route("/leaderboard")
    .get(scoresController.getLeaderBoard);

scoresRouter.route("/:user_id")
    .get(scoresController.scoreByUserId);

export default scoresRouter;