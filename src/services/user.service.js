import ApiError from "../errors/auth.errors.js";
import db from "./../models/index.js";

export async function getUser(user_id) {
    const user = await db.User.findByPk(user_id);
    if (!user) {
        throw new ApiError(404, "Utilisateur non trouvé.")
    };

    return { user };
}

export async function updateUser(user_id, updates) {
    const updatedData = {};
    if (updates.username) updatedData.username = updates.username;
    if (updates.email) updatedData.email = updates.email;
    if (updates.description) updatedData.description = updates.description;


    const updatedUser = await db.User.findByPk(user_id);
    if (!updatedUser) {
        throw new ApiError(404, "Utilisateur non trouvé.")
    }

    await updatedUser.update(updatedData);

    return { updatedUser };
}

export async function removeUser(user_id) {
    const userFound = await db.User.findByPk(user_id);
    if (!userFound) {
        throw new ApiError(404, "Utilisateur non trouvé.")
    }

    const deletedUserData = {
        user_id: userFound.user_id,
        email: userFound.email
    }

    await userFound.destroy();

    return { deletedUserData };
}