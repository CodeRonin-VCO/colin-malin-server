import { hash, verify } from "argon2";
import ApiError from "../errors/auth.errors.js";
import db from "./../models/index.js";
import { generateToken } from "../utils/jwt.utils.js";
import { v4 as uuidv4 } from 'uuid';

// todo: supprimer les username du token (// front)

export async function login(email, password) {
    const user = await db.User.findOne({ where: { email } });
    if (!user) throw new ApiError(401, "Données invalides");

    const valid = await verify(user.password, password);
    if (!valid) throw new ApiError(401, "Données invalides");

    const token = await generateToken({
        user_id: user.user_id,
        username: user.username,
        role: user.role
    })

    return { user, token };
}

export async function register(username, email, password) {
    const user = await db.User.findOne({ where: { email } });
    if (user) throw new ApiError(400, "Cet email est déjà utilisé.");

    const newUser = await db.User.create({
        user_id: uuidv4(),
        username,
        email,
        password: await hash(password),
        role: "user"
    })

    const token = await generateToken({
        user_id: newUser.user_id,
        username: newUser.username,
        role: newUser.role
    });

    return {newUser, token}
}

export async function updatePwd(email, oldPassword, newPassword) {
    const user = await db.User.findOne({ where: { email } });
    if (!user) throw new ApiError(404, "Aucun utilisateur trouvé.");

    const valid = await verify(user.password, oldPassword);
    if (!valid) throw new ApiError(401, "Ancien password incorrect.");

    const hashNewPwd = await hash(newPassword);

    user.password = hashNewPwd;

    await user.save();
}