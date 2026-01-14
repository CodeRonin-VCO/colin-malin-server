import { Router } from "express";
import questionsController from "../controllers/questions.controller.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";
import { validateFields } from "../middlewares/validationBody.middleware.js";
import { CREATE_QUESTION_SCHEMA, FILTERED_QUESTION_SCHEMA, MODIFY_QUESTION_SCHEMA } from "../schemas/questions.schema.js";


const questionsRouter = Router();

questionsRouter.route("/")
    .get(paginationMiddleware, questionsController.getAll)
    .post(validateFields(CREATE_QUESTION_SCHEMA), questionsController.create);

questionsRouter.route("/search")
    .get(paginationMiddleware, questionsController.getBySearch);
    
questionsRouter.route("/filtered")
    .post(validateFields(FILTERED_QUESTION_SCHEMA), questionsController.filtered);

questionsRouter.route("/:question_id")
    .get(questionsController.getById)
    .put(validateFields(MODIFY_QUESTION_SCHEMA), questionsController.update)
    .delete(questionsController.delete);


export default questionsRouter;