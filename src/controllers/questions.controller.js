import { Op, Sequelize } from "sequelize";
import db from "./../models/index.js";
import { v4 as uuidv4 } from 'uuid';

const questionsController = {
    getAll: async (req, res) => {
        const { offset = 0, limit = 20 } = req.pagination;

        try {
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

        } catch (error) {
            console.error("Error fetching questions:", error);
            res.status(500).json({ message: "Une erreur est survenue lors de la récupération des questions." });
        }
    },
    filtered: async (req, res) => {
        console.log("Requête reçue sur /filtered"); // ← ici
        console.log("Corps de la requête :", req.body); // ← ici
        const { nb_questions, theme, difficulty } = req.body;

        if (!Array.isArray(theme) || !difficulty || !nb_questions) {
            return res.status(400).json({ message: "Paramètres requis manquants." });
        };

        try {
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

        } catch (error) {
            console.error("Error fetching questions:", error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la récupération des questions." });
        };
    },
    create: async (req, res) => {
        const { theme, question, answers, correct_answer, difficulty } = req.body;

        if (!theme || !question || !Array.isArray(answers) || answers.length === 0 || !correct_answer || !difficulty) {
            return res.status(400).json({ message: "Tous les champs sont requis et doivent être valides." });
        };

        if (!answers.includes(correct_answer)) {
            return res.status(400).json({ message: "La réponse correcte doit faire partie des propositions." });
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

        try {
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

        } catch (error) {
            console.error("Error creating question:", error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la création de la question." });
        }
    },
    getById: async (req, res) => {
        const { question_id } = req.params;

        try {
            const question = await db.Question.findByPk(question_id);
            if (!question) {
                return res.status(404).json({ message: "La question n'a pas été trouvée." });
            };

            return res.status(200).json({ question, message: "La question a été trouvée avec succès." });

        } catch (error) {
            console.error("Error retrieving question:", error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la récupération de la question." });
        }
    },
    modify: async (req, res) => {
        const { question_id } = req.params;
        const { theme, question, answers, correct_answer, difficulty } = req.body;

        try {
            const questionFound = await db.Question.findByPk(question_id);
            if (!questionFound) {
                return res.status(404).json({ message: "La question n'a pas été trouvée." });
            };

            questionFound.theme = theme || questionFound.theme;
            questionFound.question = question || questionFound.question;
            questionFound.answers = answers || questionFound.answers;
            questionFound.correct_answer = correct_answer || questionFound.correct_answer;
            questionFound.difficulty = difficulty || questionFound.difficulty;

            await questionFound.save();

            return res.status(200).json({ questionFound, message: "La question a été mise à jour avec succès." })
        } catch (error) {
            console.error("Error updating question:", error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour de la question." });
        }
    },
    delete: async (req, res) => {
        const { question_id } = req.params;

        try {
            const question = await db.Question.findByPk(question_id);
            if (!question) {
                return res.status(404).json({ message: "La question n'a pas été trouvée." });
            };

            await question.destroy();

            return res.status(200).json({ message: "La question a été supprimée avec succès." });

        } catch (error) {
            console.error("Error deleting question:", error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la suppression de la question." });
        }
    },
}

export default questionsController;