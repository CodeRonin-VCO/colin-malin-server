export const CREATE_QUESTION_SCHEMA = Object.freeze({
    theme: { type: "string", required: true },
    question: { type: "string", required: true },
    answers: { type: "array", required: true, min: 1, of: "string" },
    correct_answer: { type: "string", required: true },
    difficulty: { type: "string", required: true }
});


export const FILTERED_QUESTION_SCHEMA = Object.freeze({
    nb_questions: { type: "number", required: true },
    theme: { type: "array", required: true, min: 1, of: "string" },
    difficulty: { type: "string", required: true }
});

export const MODIFY_QUESTION_SCHEMA = Object.freeze({
    theme: { type: "string" },
    question: { type: "string" },
    answers: { type: "array", min: 1, of: "string" },
    correct_answer: { type: "string" },
    difficulty: { type: "string" }
});