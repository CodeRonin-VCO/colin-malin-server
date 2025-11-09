import { DataTypes, Sequelize } from "sequelize";

/**
 * 
 * @param {Sequelize} sequelize 
 */
export default function usersModel(sequelize) {
    const User = sequelize.define(
        "User",
        {
            user_id: {
                type: DataTypes.TEXT,
                allowNull: false,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING(250),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            role: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: "user"
            }

        }, {
        tableName: "user",
        timestamps: true, // active les champs createdAt et updatedAt
        underscored: true
    }
    )
    return User;
}