import * as gamesService from "./../services/games.service.js";

const gamesController = {
    getGames: async (req, res) => {
        const userId = req.user?.user_id;
        const {
            games,
            totalCountGames,
            totalCountQuestions,
            totalCorrectAnswers
        } = await gamesService.getGames(userId);


        return res.status(200).json({
            games,
            totalCountGames,
            totalCountQuestions,
            totalCorrectAnswers,
            message: "Parties trouvées."
        });
    },
    createGame: async (req, res) => {
        const { user_id } = req.user;
        const { nb_questions, theme, difficulty, mode, questions } = req.body;

        const { newGame, gameQuestions } = await gamesService.createGames(user_id, nb_questions, theme, difficulty, mode, questions);

        return res.status(201).json({
            game: newGame.toJSON(),
            questions: gameQuestions.map(q => q.toJSON()),
            message: "Partie créée avec succès."
        });
    },
    getGameById: async (req, res) => {
        const { game_id } = req.params;
        const { game } = await gamesService.getGameById(game_id);
        
        return res.status(200).json(game);
    },
}

export default gamesController;