import { Op, Sequelize } from "sequelize";
import db from "./../models/index.js";
import { v4 as uuidv4 } from 'uuid';
import * as questionsService from "./../services/questions.service.js";

const questionsController = {
    getAll: async (req, res) => {
        const { offset = 0, limit = 20 } = req.pagination;
        const { questions, total } = await questionsService.getAll(offset, limit);

        return res.status(200).json({
            questions,
            total,
            offset,
            limit,
            message: "Toutes les questions ont été récupérées avec pagination."
        });
    },
    create: async (req, res) => {
        const { theme, question, answers, correct_answer, difficulty } = req.body;
        
        const { newQuestion } = await questionsService.create(theme, question, answers, correct_answer, difficulty);

        res.status(201).json({
            question: newQuestion,
            message: "Question créée avec succès."
        })
    },
    getBySearch: async (req, res) => {
        const { offset = 0, limit = 20 } = req.pagination;
        const { query } = req.query;

        const { questions } = await questionsService.getBySearch(offset, limit, query);

        return res.status(200).json({
            questions,
            offset,
            limit,
            message: "Résultats de la recherche récupérés avec succès."
        });
    },
    filtered: async (req, res) => {
        let { nb_questions, theme, difficulty } = req.body;

        const { questions } = await questionsService.filtered(nb_questions, theme, difficulty);

        return res.status(200).json({ questions, message: "Questions filtrées récupérées avec succès." });
    },
    getById: async (req, res) => {
        const { question_id } = req.params;

        const { question } = await questionsService.getById(question_id);

        return res.status(200).json({ question, message: "La question a été trouvée avec succès." });
    },
    update: async (req, res) => {
        const { question_id } = req.params;
        const { theme, question, answers, correct_answer, difficulty } = req.body;

        const { questionFound } = await questionsService.update(question_id, theme, question, answers, correct_answer, difficulty);

        return res.status(200).json({ questionFound, message: "La question a été mise à jour avec succès." })
    },
    delete: async (req, res) => {
        const { question_id } = req.params;

        await questionsService.remove(question_id);

        return res.status(200).json({ message: "La question a été supprimée avec succès." });
    },
}

export default questionsController;