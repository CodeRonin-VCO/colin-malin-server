import { Router } from "express";
import questionsController from "../controllers/questions.controller.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";


const questionsRouter = Router();

questionsRouter.route("/")
    .get(paginationMiddleware, questionsController.getAll)
    .post(questionsController.create);

questionsRouter.route("/search")
    .get(paginationMiddleware, questionsController.getBySearch);
    
questionsRouter.route("/filtered")
    .post(questionsController.filtered);

questionsRouter.route("/:question_id")
    .get(questionsController.getById)
    .put(questionsController.modify)
    .delete(questionsController.delete);


export default questionsRouter;