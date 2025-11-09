import { DataTypes, Sequelize } from "sequelize";

/**
 * 
 * @param {Sequelize} sequelize 
 */
export default function questionsModel(sequelize) {
    const Question = sequelize.define(
        "Question",
        {
            question_id: {
                type: DataTypes.TEXT,
                allowNull: false,
                primaryKey: true
            },
            theme: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            question: {
                type: DataTypes.TEXT,
                allowNull: false,
                unique: true
            },
            answers: {
                type: DataTypes.ARRAY(DataTypes.TEXT),
                allowNull: false,
            },
            correct_answer: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            difficulty: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },
            type: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: "multiple-choice",
            }
        }, {
        tableName: "question",
        timestamps: true,
        underscored: true
    }
    );

    return Question;
}