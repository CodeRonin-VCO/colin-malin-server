import * as scoresService from "./../services/scores.service.js";

const scoresController = {
    addResults: async (req, res) => {
        const { user_id, game_id, points, time_spent, category_scores, answers } = req.body;

        const { newScore } = await scoresService.addResults(user_id, game_id, points, time_spent, category_scores, answers);

        return res.status(201).json({
            score: newScore,
            message: "Résultats sauvegardés avec succès."
        })
    },
    filtered: async (req, res) => {
        const { user_id, theme, difficulty, best } = req.query;
        const { scores } = await scoresService.filtered(user_id, theme, difficulty, best);

        return res.status(200).json({
            scores,
            message: "Scores filtrés trouvés."
        });
    },
    scoreByUserId: async (req, res) => {
        const { user_id } = req.params;
        const { theme, difficulty, startDate, endDate } = req.query;

        const { formattedScores } = await scoresService.scoreByUserId(user_id, theme, difficulty, startDate, endDate);

        return res.status(200).json({
            scores: formattedScores,
            message: "Scores de l'utilisateur trouvés."
        });
    },
    getLeaderBoard: async (req, res) => {
        return res.status(200).send("En construction...");
    }
}

export default scoresController;