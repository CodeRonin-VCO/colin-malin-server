export const ADD_RESULT_SCORES_SCHEMA = Object.freeze({
    user_id: { type: "string", required: true },
    game_id: { type: "string", required: true },
    points: { type: "number", required: true },
    time_spent: { required: false },
    category_scores: { type: "object", required: true },
    answers: { type: "array", required: true, min: 1, of: "object" },
});