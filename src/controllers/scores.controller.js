import { Op } from "sequelize";
import db from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

const scoresController = {
    addResults: async (req, res) => {
        const { user_id, game_id, points, time_spent, category_scores, answers } = req.body;
        if (!user_id || points === undefined) {
            const error = new Error("user_id et points sont requis.");
            error.status = 400;
            throw error;
        };

        const transaction = await db.sequelize.transaction();


        try {
            const newScore = await db.Score.create({
                score_id: uuidv4(),
                user_id,
                game_id,
                points,
                time_spent,
                category_scores
            }, { transaction });

            // Mise à jour des réponses dans GameQuestion
            if (Array.isArray(answers)) {
                await Promise.all(
                    answers.map(async (a) => {
                        await db.GameQuestion.update(
                            {
                                user_answer: a.user_answer,
                                is_correct: a.is_correct
                            },
                            {
                                where: {
                                    game_id,
                                    question_id: a.question_id
                                },
                                transaction
                            }
                        );
                    })
                );
            };

            await transaction.commit();

            return res.status(201).json({
                score: newScore,
                message: "Résultats sauvegardés avec succès."
            })

        } catch (error) {
            await transaction.rollback();
            throw error; // catché par errorHandler
        }
    },
    filtered: async (req, res) => {
        const { user_id, theme, difficulty, best } = req.query;

        const whereScore = {};
        const whereGame = {};

        if (user_id) {
            whereScore.user_id = user_id;
        }

        if (theme) {
            whereGame.theme = theme;
        }

        if (difficulty) {
            whereGame.difficulty = difficulty;
        }

        const scores = await db.Score.findAll({
            where: whereScore,
            include: [{
                model: db.Game,
                attributes: ["theme", "difficulty", "nb_questions"],
                where: whereGame
            }],
            order: best ? [["points", "DESC"]] : [["created_at", "DESC"]],
            limit: best ? 1 : undefined
        });

        if (!scores || scores.length === 0) {
            const error = new Error("Aucun score trouvé avec ces filtres.");
            error.status = 404;
            throw error;
        }

        return res.status(200).json({
            scores,
            message: "Scores filtrés trouvés."
        });
    },
    scoreByUserId: async (req, res) => {
        const { user_id } = req.params;
        const { theme, difficulty, startDate, endDate } = req.query;

        if (!user_id) {
            const error = new Error("Aucun utilisateur trouvé.");
            error.status = 404;
            throw error;
        };

        const whereScore = { user_id };
        const whereGame = {};

        if (theme) {
            whereGame.theme = theme;
        };

        if (difficulty) {
            whereGame.difficulty = difficulty;
        };

        if (startDate || endDate) {
            whereScore.createdAt = {};
            if (startDate) {
                whereScore.createdAt[Op.gte] = new Date(startDate); // début du jour
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // fin de la journée
                whereScore.createdAt[Op.lte] = end;
            }
        };

        const scores = await db.Score.findAll({
            where: whereScore,
            include: [{
                model: db.Game,
                attributes: ["theme", "difficulty", "nb_questions"],
                where: whereGame
            }],
            order: [["created_at", "ASC"]]
        });

        if (!scores || scores.length === 0) {
            const error = new Error("Aucun score trouvé pour cet utilisateur.");
            error.status = 404;
            throw error;
        };

        // Structure de retour données back
        const formattedScores = scores.map(score => ({
            score_id: score.score_id,
            points: score.points,
            created_at: score.createdAt,
            theme: score.Game?.theme,
            difficulty: score.Game?.difficulty,
            nb_questions: score.Game?.nb_questions
        }));

        return res.status(200).json({
            scores: formattedScores,
            message: "Scores de l'utilisateur trouvés."
        });
    },
    getLeaderBoard: async (req, res) => {

    }
}

export default scoresController;