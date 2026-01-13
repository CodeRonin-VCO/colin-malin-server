import db from "./../models/index.js";
import { v4 as uuidv4 } from 'uuid';

const gamesController = {
    getGames: async (req, res) => {
        const userId = req.user?.user_id;

        if (!userId) {
            const error = new Error("Utilisateur non authentifié.");
            error.status = 401;
            throw error;
        };

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
            const error = new Error("Aucune partie trouvée.");
            error.status = 404;
            throw error;
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

        return res.status(200).json({
            games,
            totalCountGames,
            totalCountQuestions,
            totalCorrectAnswers,
            message: "Parties trouvées."
        });
    },
    createGame: async (req, res) => {
        const { user_id, nb_questions, theme, difficulty, mode, questions } = req.body;

        if (!user_id || questions === null) {
            const error = new Error("Données manquantes.");
            error.status = 400;
            throw error;
        };

        if (!Array.isArray(questions) || questions.length === 0) {
            const error = new Error("Le champ questions doit être un tableau non vide.");
            error.status = 400;
            throw error;
        };

        for (const q of questions) {
            if (!q.question_id) {
                const error = new Error("Chaque question doit contenir question_id et user_answer.");
                error.status = 400;
                throw error;
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
    
            return res.status(201).json({
                game: newGame.toJSON(),
                questions: gameQuestions.map(q => q.toJSON()),
                message: "Partie créée avec succès."
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
    getGameById: async (req, res) => {
        const { game_id } = req.params;

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
            const error = new Error("Partie non trouvée.");
            error.status = 404;
            throw error;
        };

        return res.status(200).json(game);
    },
}

export default gamesController;