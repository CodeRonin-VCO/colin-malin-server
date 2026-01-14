import db from "./../models/index.js";
import * as userService from "./../services/user.service.js";

const userController = {
    getUser: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { user_id } = req.user;

        const { user } = await userService.getUser(user_id);

        return res.status(200).json({
            message: "User retrieved successfully.",
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                description: user.description,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    },
    updateUser: async (req, res) => {
        const { user_id } = req.user;
        const updates = req.body;

        const { updatedUser } = await userService.updateUser(user_id, updates);        

        return res.status(200).json({
            message: "User data updated successfully.",
            user: {
                user_id: updatedUser.user_id,
                username: updatedUser.username,
                email: updatedUser.email,
                description: updatedUser.description,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        });
    },
    removeUser: async (req, res) => {
        const { user_id } = req.user;

        const { deletedUserData } = await userService.removeUser(user_id);

        return res.status(200).json({
            message: "User deleted successfully.",
            user: deletedUserData
        });
    }
}

export default userController;