import db from "./../models/index.js";

const userController = {
    getUser: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { user_id } = req.user;

        // ==== Vérifier si l'utilisateur existe ====
        const userFound = await db.User.findByPk(user_id);
        if (!userFound) {
            const error = new Error("User not found");
            error.status = 404;
            throw error; // le middleware d'erreur va gérer la réponse
        };

        return res.status(200).json({
            message: "User retrieved successfully.",
            user: {
                user_id: userFound.user_id,
                username: userFound.username,
                email: userFound.email,
                description: userFound.description,
                createdAt: userFound.createdAt,
                updatedAt: userFound.updatedAt
            }
        });
    },
    updateUser: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { user_id } = req.user;
        const updates = req.body;

        // ==== Champs à mettre à jour ====
        const updatedData = {};
        if (updates.username) updatedData.username = updates.username;
        if (updates.email) updatedData.email = updates.email;
        if (updates.description) updatedData.description = updates.description;


        // ==== Vérifier si l'utilisateur existe ====
        const updatedUser = await db.User.findByPk(user_id);
        if (!updatedUser) {
            const error = new Error("User not found.");
            error.status = 404;
            throw error;
        }

        // ==== Mettre à jour les champs dans la db ====
        await updatedUser.update(updatedData);

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

        const userFound = await db.User.findByPk(user_id);
        if (!userFound) {
            const error = new Error("User not found.");
            error.status = 404;
            throw error;
        }

        const deletedUserData = {
            user_id: userFound.user_id,
            email: userFound.email
        }

        await userFound.destroy();


        return res.status(200).json({
            message: "User deleted successfully.",
            user: deletedUserData
        });
    }
}

export default userController;