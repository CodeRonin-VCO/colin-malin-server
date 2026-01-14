import db from "./../models/index.js";
import { v4 as uuidv4 } from 'uuid';
import { Op, Sequelize } from "sequelize";
import ApiError from "../errors/auth.errors.js";


export async function getAll(offset, limit) {
    const questions = await db.Question.findAll({
        order: [["created_at", "DESC"]],
        offset,
        limit
    });

    if (questions.length === 0) {
        throw new ApiError(404, "Aucune question n'a été trouvée.");
    }

    const total = await db.Question.count();

    return { questions, total };
}

export async function create(theme, question, answers, correct_answer, difficulty) {
    if (!theme || !question || !Array.isArray(answers) || answers.length === 0 || !correct_answer || !difficulty) {
        throw new ApiError(400, "Tous les champs sont requis et doivent être valides.");
    };

    if (!answers.includes(correct_answer)) {
        throw new ApiError(400, "La réponse correcte doit faire partie des propositions.");
    };

    // Vérifier les doublons des questions en normalisant la casse
    const normalizedQuestion = question.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\?+$/, '?');

    const existingQuestion = await db.Question.findOne({
        where: {
            question: db.sequelize.where(
                db.sequelize.fn('LOWER', db.sequelize.fn('TRIM', db.sequelize.col('question'))),
                '=', normalizedQuestion
            )
        }
    });

    if (existingQuestion) {
        throw new ApiError(409, "Cette question existe déjà dans la base de données.");
    }

    const newQuestion = await db.Question.create({
        question_id: uuidv4(),
        theme,
        question,
        answers,
        correct_answer,
        difficulty,
    });

    return { newQuestion };
}

export async function getBySearch(offset, limit, query) {
    if (!query) {
        throw new ApiError(400, "Le paramètre de recherche est requis.")
    }

    const questions = await db.Question.findAll({
        where: {
            question: {
                [Op.iLike]: `%${query}%` // recherche insensible à la casse
            }
        },
        order: [["created_at", "DESC"]],
        limit,
        offset
    });

    return { questions };
}

export async function filtered(nb_questions, theme, difficulty) {
    if (!Array.isArray(theme) || !difficulty || !nb_questions) {
        throw new ApiError(400, "Paramètres requis manquants.");
    };

    // Si theme = ["mix"], on récupère tous les thèmes distincts
    if (theme.length === 1 && theme[0] === "mix") {
        const allThemes = await db.Question.findAll({
            attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("theme")), "theme"]],
            raw: true,
        });
        theme = allThemes.map(t => t.theme);
    }

    // Si difficulty = "all", on récupère toutes les difficultés distinctes
    // todo: refactor → let resolvedTheme / let resolvedDifficulty
    if (difficulty === "all") {
        const allDifficulties = await db.Question.findAll({
            attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("difficulty")), "difficulty"]],
            raw: true,
        });
        difficulty = allDifficulties.map(d => d.difficulty);
    }

    const questions = await db.Question.findAll({
        where: {
            theme: { [Op.in]: theme },
            difficulty: Array.isArray(difficulty) ? { [Op.in]: difficulty } : difficulty
        },
        order: Sequelize.literal("RANDOM()"), //aléatoire
        limit: parseInt(nb_questions),
    });

    return { questions };
}

export async function getById(question_id) {
    const question = await db.Question.findByPk(question_id);
    if (!question) {
        throw new ApiError(404, "La question n'a pas été trouvée.");
    };

    return { question };
}

export async function update(question_id, theme, question, answers, correct_answer, difficulty) {
    const questionFound = await db.Question.findByPk(question_id);
    if (!questionFound) {
        throw new ApiError(404, "La question n'a pas été trouvée.");
    };

    questionFound.theme = theme || questionFound.theme;
    questionFound.question = question || questionFound.question;
    questionFound.answers = answers || questionFound.answers;
    questionFound.correct_answer = correct_answer || questionFound.correct_answer;
    questionFound.difficulty = difficulty || questionFound.difficulty;

    await questionFound.save();

    return { questionFound };
}

export async function remove(question_id) {
    const question = await db.Question.findByPk(question_id);
    if (!question) {
        throw new ApiError(404, "La question n'a pas été trouvée.")
    };

    await question.destroy();
}