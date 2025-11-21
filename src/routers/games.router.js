import { Router } from "express";
import gamesController from "../controllers/games.controller.js";


const gamesRouter = Router();

gamesRouter.route("/")
    .get(gamesController.getGames)
    .post(gamesController.createGame);

gamesRouter.route("/:games_id")
    .get(gamesController.getGameById);


export default gamesRouter;