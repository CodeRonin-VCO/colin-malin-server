import { Router } from "express";
import questionsController from "../controllers/questions.controller.js";


const questionsRouter = Router();

questionsRouter.route("/")
    .get(questionsController.getAll)
    .post(questionsController.create);

questionsRouter.route("/filtered")
    .post(questionsController.filtered);

questionsRouter.route("/:id")
    .get(questionsController.getById)
    .put(questionsController.modify)
    .delete(questionsController.delete);


export default questionsRouter;