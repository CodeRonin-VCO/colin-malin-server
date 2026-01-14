import { Op } from "sequelize";
import db from "./../models/index.js";
import { v4 as uuidv4 } from 'uuid';
import ApiError from "../errors/auth.errors.js";

export async function addResults(user_id, game_id, points, time_spent, category_scores, answers) {
    if (!user_id || points === undefined) {
        throw new ApiError(400, "user_id et points sont requis.");
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

        return { newScore };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

export async function filtered(user_id, theme, difficulty, best) {
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
        throw new ApiError(404, "Aucun score trouvé avec ces filtres.")
    }

    return { scores };
}

export async function scoreByUserId(user_id, theme, difficulty, startDate, endDate) {
    if (!user_id) {
        throw new ApiError(404, "Aucun utilisateur trouvé.")
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
        throw new ApiError(404, "Aucun score trouvé pour cet utilisateur.")
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

    return { formattedScores };
}