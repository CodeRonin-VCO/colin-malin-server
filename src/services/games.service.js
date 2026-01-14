import ApiError from "../errors/auth.errors.js";
import db from "./../models/index.js";
import { v4 as uuidv4 } from 'uuid';


export async function getGames(userId) {
    const games = await db.Game.findAll({
        where: { user_id: userId },
        include: [
            {
                model: db.GameQuestion,
                as: "questions",
                include: [
                    {
                        model: db.Question,
                        as: "question",
                    }
                ]
            }
        ]
    });

    if (games.length === 0) {
        throw new ApiError(404, "Aucune partie trouvée.")
    };

    // Calcul des stats à partir des parties récupérées
    const totalCountGames = games.length;
    const totalCountQuestions = games.reduce(
        (acc, game) => acc + (game.questions?.length || 0),
        0
    );
    const totalCorrectAnswers = games.reduce(
        (acc, game) => acc + game.questions.filter(q => q.is_correct).length,
        0
    );

    return {
        games,
        totalCountGames,
        totalCountQuestions,
        totalCorrectAnswers
    }
}

export async function createGames(user_id, nb_questions, theme, difficulty, mode, questions) {
    if (!user_id || questions === null) {
        throw new ApiError(400, "Données manquantes.")
    };

    if (!Array.isArray(questions) || questions.length === 0) {
        throw new ApiError(400, "Le champ questions doit être un tableau non vide.")
    };

    for (const q of questions) {
        if (!q.question_id) {
            throw new ApiError(400, "Chaque question doit contenir question_id et user_answer.")
        }
    };

    // Transaction
    const transaction = await db.sequelize.transaction();

    try {
        // Game
        const newGame = await db.Game.create({
            game_id: uuidv4(),
            user_id,
            nb_questions,
            theme,
            difficulty,
            mode,
        }, { transaction });

        // GameQuestion
        const gameQuestions = await Promise.all(questions.map((q) =>
            db.GameQuestion.create({
                game_question_id: uuidv4(),
                game_id: newGame.game_id,
                question_id: q.question_id,
                user_answer: q.user_answer,
                is_correct: null,
                answered_at: new Date(),
            }, { transaction })
        ));

        // Valider la transaction
        await transaction.commit();

        return {
            newGame,
            gameQuestions
        }

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

export async function getGameById(game_id) {
    const game = await db.Game.findOne({
        where: { game_id },
        include: [
            {
                model: db.GameQuestion,
                as: "questions", // Alias
                include: [
                    {
                        model: db.Question,
                        as: "question",
                    }
                ]
            }
        ]
    });

    if (!game) {
        throw new ApiError(404, "Partie non trouvée.")
    };

    return { game };
}