import { Router } from "express";
import gamesController from "../controllers/games.controller.js";
import { validateFields } from "../middlewares/validationBody.middleware.js";
import CREATE_GAME_SCHEMA from "../schemas/games.schema.js";


const gamesRouter = Router();

gamesRouter.route("/")
    .get(gamesController.getGames)
    .post(validateFields(CREATE_GAME_SCHEMA), gamesController.createGame);

gamesRouter.route("/:games_id")
    .get(gamesController.getGameById);

export default gamesRouter;