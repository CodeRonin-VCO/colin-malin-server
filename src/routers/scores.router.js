import { Router } from "express";
import scoresController from "../controllers/scores.controller.js";
import { validateFields } from "../middlewares/validationBody.middleware.js";
import { ADD_RESULT_SCORES_SCHEMA } from "../schemas/scores.schema.js";

const scoresRouter = Router();

scoresRouter.route("/")
    .get(scoresController.filtered)
    .post(validateFields(ADD_RESULT_SCORES_SCHEMA), scoresController.addResults);

scoresRouter.route("/leaderboard")
    .get(scoresController.getLeaderBoard);

scoresRouter.route("/:user_id")
    .get(scoresController.scoreByUserId);

export default scoresRouter;