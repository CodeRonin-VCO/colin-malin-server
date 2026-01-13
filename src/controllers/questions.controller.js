import { Op, Sequelize } from "sequelize";
import db from "./../models/index.js";
import { v4 as uuidv4 } from 'uuid';

const questionsController = {
    getAll: async (req, res) => {
        const { offset = 0, limit = 20 } = req.pagination;

        const questions = await db.Question.findAll({
            order: [["created_at", "DESC"]],
            limit,
            offset
        });

        const total = await db.Question.count();

        return res.status(200).json({
            questions,
            total,
            offset,
            limit,
            message: "Toutes les questions ont été récupérées avec pagination."
        });
    },
    getBySearch: async (req, res) => {
        const { offset = 0, limit = 20 } = req.pagination;
        const { query } = req.query;

        if (!query) {
            const error = new Error("Le paramètre de recherche est requis.");
            error.status = 400;
            throw error;
        }

        const questions = await db.Question.findAll({
            where: {
                question: {
                    [Op.iLike]: `%${query}%` // recherche insensible à la casse
                }
            },
            order: [["created_at", "DESC"]],
            limit,
            offset
        });

        return res.status(200).json({
            questions,
            offset,
            limit,
            message: "Résultats de la recherche récupérés avec succès."
        });
    },
    filtered: async (req, res) => {
        let { nb_questions, theme, difficulty } = req.body;

        if (!Array.isArray(theme) || !difficulty || !nb_questions) {
            const error = new Error("Paramètres requis manquants.");
            error.status = 400;
            throw error;
        };

        // Si theme = ["mix"], on récupère tous les thèmes distincts
        if (theme.length === 1 && theme[0] === "mix") {
            const allThemes = await db.Question.findAll({
                attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("theme")), "theme"]],
                raw: true,
            });
            theme = allThemes.map(t => t.theme);
        }

        // Si difficulty = "all", on récupère toutes les difficultés distinctes
        if (difficulty === "all") {
            const allDifficulties = await db.Question.findAll({
                attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("difficulty")), "difficulty"]],
                raw: true,
            });
            difficulty = allDifficulties.map(d => d.difficulty);
        }

        const questions = await db.Question.findAll({
            where: {
                theme: { [Op.in]: theme },
                difficulty: Array.isArray(difficulty) ? { [Op.in]: difficulty } : difficulty
            },
            order: Sequelize.literal("RANDOM()"), //aléatoire
            limit: parseInt(nb_questions),
        });
        return res.status(200).json({ questions, message: "Questions filtrées récupérées avec succès." });
    },
    create: async (req, res) => {
        const { theme, question, answers, correct_answer, difficulty } = req.body;

        if (!theme || !question || !Array.isArray(answers) || answers.length === 0 || !correct_answer || !difficulty) {
            const error = new Error("Tous les champs sont requis et doivent être valides.");
            error.status = 400;
            throw error;
        };

        if (!answers.includes(correct_answer)) {
            const error = new Error("La réponse correcte doit faire partie des propositions.");
            error.status = 400;
            throw error;
        };

        // Vérifier les doublons des questions en normalisant la casse
        const normalizedQuestion = question.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\?+$/, '?');

        const existingQuestion = await db.Question.findOne({
            where: {
                question: db.sequelize.where(
                    db.sequelize.fn('LOWER', db.sequelize.fn('TRIM', db.sequelize.col('question'))),
                    '=', normalizedQuestion
                )
            }
        });

        if (existingQuestion) {
            return res.status(409).json({ message: "Cette question existe déjà dans la base de données." })
        }

        const newQuestion = await db.Question.create({
            question_id: uuidv4(),
            theme,
            question,
            answers,
            correct_answer,
            difficulty,
        });

        res.status(201).json({
            question: newQuestion,
            message: "Question créée avec succès."
        })
    },
    getById: async (req, res) => {
        const { question_id } = req.params;

        const question = await db.Question.findByPk(question_id);
        if (!question) {
            const error = new Error("La question n'a pas été trouvée.");
            error.status = 404;
            throw error;
        };

        return res.status(200).json({ question, message: "La question a été trouvée avec succès." });
    },
    modify: async (req, res) => {
        const { question_id } = req.params;
        const { theme, question, answers, correct_answer, difficulty } = req.body;

        const questionFound = await db.Question.findByPk(question_id);
        if (!questionFound) {
            const error = new Error("La question n'a pas été trouvée.");
            error.status = 404;
            throw error;
        };

        questionFound.theme = theme || questionFound.theme;
        questionFound.question = question || questionFound.question;
        questionFound.answers = answers || questionFound.answers;
        questionFound.correct_answer = correct_answer || questionFound.correct_answer;
        questionFound.difficulty = difficulty || questionFound.difficulty;

        await questionFound.save();

        return res.status(200).json({ questionFound, message: "La question a été mise à jour avec succès." })
    },
    delete: async (req, res) => {
        const { question_id } = req.params;

        const question = await db.Question.findByPk(question_id);
        if (!question) {
            const error = new Error("La question n'a pas été trouvée.");
            error.status = 404;
            throw error;
        };

        await question.destroy();

        return res.status(200).json({ message: "La question a été supprimée avec succès." });
    },
}

export default questionsController;