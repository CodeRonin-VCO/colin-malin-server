import db from "./../models/index.js";

const userController = {
    getUser: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { user_id } = req.user;

        try {
            // ==== Vérifier si l'utilisateur existe ====
            const userFound = await db.User.findByPk(user_id);
            if (!userFound) {
                res.status(404).json({ error: "User not found." })
                return;
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

        } catch (error) {
            console.error("Error getting user data", error);
            res.status(500).json({
                message: "Error getting user data.",
                error: error.message
            })
            return;
        }
    },
    modifyUser: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { user_id } = req.user;
        const updates = req.body;

        // ==== Champs à mettre à jour ====
        const updatedData = {};
        if (updates.username) updatedData.username = updates.username;
        if (updates.email) updatedData.email = updates.email;
        if (updates.description) updatedData.description = updates.description;


        try {
            // ==== Vérifier si l'utilisateur existe ====
            const updatedUser = await db.User.findByPk(user_id);
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." })
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

        } catch (error) {
            console.error("An error occured while updating user :", error);
            console.error("Sent data for update :", updatedData);

            return res.status(500).json({
                message: "An error occured while updating user.",
                error: error.message
            });
        }
    },
    deleteUser: async (req, res) => {
        const { user_id } = req.user;

        try {
            const userFound = await db.User.findByPk(user_id);
            if (userFound) {
                await userFound.destroy();
            } else {
                return res.status(404).json({ message: "User not found." })
            };

            return res.status(200).json({
                message: "User deleted successfully.",
                user: {
                    user_id: userFound.user_id,
                    email: userFound.email
                }
            });

        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({
                message: "Error deleting user.",
                error: error.message
            });
            return;
        }
    }
}

export default userController;