import { DataTypes, Sequelize } from "sequelize";


/**
 * 
 * @param {Sequelize} sequelize 
 */
export default function scoreModel(sequelize) {
    const Score = sequelize.define(
        "Score",
        {
            score_id: {
                type: DataTypes.TEXT,
                primaryKey: true,
                allowNull: false
            },
            game_id: {
                type: DataTypes.TEXT,
                allowNull: false,
                references: {
                    model: "game", // Référence à la table Game
                    key: "game_id"
                }
            },
            user_id: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            points: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            time_spent: { 
                type: DataTypes.INTEGER,
                allowNull: true
            },
            category_scores: {
                type: DataTypes.JSONB,
                allowNull: true
            }
        },
        {
            tableName: "score",
            timestamps: true,
            underscored: true
        }
    );

    Score.associate = (models) => {
        Score.belongsTo(models.Game, {
            foreignKey: "game_id",
            onDelete: "CASCADE"
        });
        Score.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        });
    };

    return Score;
}
