import db from "./../models/index.js";
import { v4 as uuidv4 } from 'uuid';

const gamesController = {
    getGames: async (req, res) => {
        const userId = req.user?.user_id;

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié." });
        };

        try {
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
                return res.status(404).json({ message: "Aucune partie trouvée." });
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

        } catch (error) {
            console.error("Erreur lors de la recherche des parties :", error);
            return res.status(500).json({ error: "Erreur interne du serveur." });
        };
    },
    createGame: async (req, res) => {
        const { user_id, nb_questions, theme, difficulty, mode, questions } = req.body;

        if (!user_id || questions === null) {
            return res.status(400).json({ error: "Données manquantes." });
        };

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "Le champ questions doit être un tableau non vide." });
        };

        for (const q of questions) {
            if (!q.question_id) {
                return res.status(400).json({ error: "Chaque question doit contenir question_id et user_answer." });
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
            // Annuler la transaction en cas d'erreur
            await transaction.rollback();

            console.error("Erreur lors de la création de la partie :", error);
            return res.status(500).json({ error: "Erreur interne du serveur." });
        };
    },
    getGameById: async (req, res) => {
        const { game_id } = req.params;

        try {
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
                return res.status(404).json({ error: "Partie non trouvée." });
            };

            return res.status(200).json(game);

        } catch (error) {
            console.error("Erreur lors de la récupération de la partie :", error);
            return res.status(500).json({ error: "Erreur interne du serveur." });
        }
    },
}

export default gamesController;