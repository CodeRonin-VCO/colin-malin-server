const CREATE_GAME_SCHEMA = Object.freeze({
    nb_questions: { type: "number", required: true },
    theme: { type: "array", required: true, min: 1, of: "string" },
    difficulty: { type: "string", required: true },
    mode: { type: "string", required: true },
    questions: { type: "array", required: true, min: 1, of: "object" }
});

export default CREATE_GAME_SCHEMA;