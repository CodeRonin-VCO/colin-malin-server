import { DataTypes, Sequelize } from "sequelize";

/**
 * 
 * @param {Sequelize} sequelize 
 */
export default function gameModel(sequelize) {
    const Game = sequelize.define(
        "Game",
        {
            game_id: {
                type: DataTypes.TEXT,
                allowNull: false,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            nb_questions: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            theme: {
                type: DataTypes.ARRAY(DataTypes.STRING), // ou STRING si tu préfères stocker en CSV
                allowNull: false
            },
            difficulty: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    isIn: [['low', 'medium', 'high', 'all']]
                }
            },
            mode: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    isIn: [['solo', 'multi']], // Équivalent au CHECK de SQL
                }
            },
            played_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW, // Équivalent au DEFAULT NOW() de SQL
            }
        }, {
        tableName: "game",
        timestamps: true,
        underscored: true
    }
    );

    // Définition de la clé étrangère
    Game.associate = (models) => {
        Game.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE", // Équivalent au ON DELETE CASCADE de SQL
        });
    };

    return Game;
}