import { DataTypes, Sequelize } from "sequelize";


/**
 * 
 * @param {Sequelize} sequelize 
 */
export default function gameQuestionModel(sequelize) {
    const GameQuestion = sequelize.define(
        "GameQuestion",
        {
            game_question_id: {
                type: DataTypes.TEXT,
                allowNull: false,
                primaryKey: true,
            },
            game_id: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            question_id: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            user_answer: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            is_correct: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            answered_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "GameQuestion",
            timestamps: false,
            underscored: true
        }
    );

    // Définition des clés étrangères
    GameQuestion.associate = (models) => {
        GameQuestion.belongsTo(models.Game, {
            foreignKey: "game_id",
            onDelete: "CASCADE",
        });
        GameQuestion.belongsTo(models.Question, {
            foreignKey: "question_id",
            onDelete: "CASCADE",
        });
    };

    return GameQuestion;
}