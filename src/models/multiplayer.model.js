import { DataTypes, Sequelize } from "sequelize";


/**
 * 
 * @param {Sequelize} sequelize 
 */
export default function multiplayerModel(sequelize) {
    const Multiplayer = sequelize.define(
        "Multiplayer",
        {
            multi_id: {
                type: DataTypes.TEXT,
                allowNull: false,
                primaryKey: true,
            },
            game_id: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            score: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            joined_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "Multiplayer",
            timestamps: false,
        }
    );

    // Définition des clés étrangères
    Multiplayer.associate = (models) => {
        Multiplayer.belongsTo(models.Game, {
            foreignKey: "game_id",
            onDelete: "CASCADE",
        });
        Multiplayer.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
    };

    return Multiplayer;
}