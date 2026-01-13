import { hash, verify } from "argon2";
import { generateToken } from "../utils/jwt.utils.js";
import { v4 as uuidv4 } from 'uuid';
import db from "./../models/index.js";
import createHttpError from "http-errors";


const authController = {
    login: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { email, password } = req.body;

        // ==== Vérifier si l'utilisateur existe ====
        const userFound = await db.User.findOne({ where: { email } });
        // Si non → erreur 400
        if (!userFound) {
            throw createHttpError(401, "Données invalides.");
        };

        // Si oui → validation
        const isPasswordValid = await verify(userFound.password, password);
        if (!isPasswordValid) {
            throw createHttpError(401, "Données invalides.")
        };

        // ==== Générer le token et l'envoyer à l'utilisateur
        const token = await generateToken({
            user_id: userFound.user_id,
            username: userFound.username,
            role: userFound.role
        });

        return res.status(200).location(`/api/auth/${userFound.email}`).json({
            message: "Connected successfully.",
            token,
            user: {
                user_id: userFound.user_id,
                email: userFound.email,
                username: userFound.username,
                role: userFound.role,
                createdAt: userFound.createdAt,
                updatedAt: userFound.updatedAt
            }
        });
    },
    register: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { username, email, password } = req.body;

        // ==== Vérifier si l'utilisateur existe déjà ====
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) {
            throw createHttpError(400, "Cet email est déjà utilisé");
        }

        // ==== Création d'un nouvel utilisateur ====
        const newUser = await db.User.create({
            user_id: uuidv4(),
            username,
            email,
            password: await hash(password),
            role: "user"
        });

        // todo: rendre les rôles dynamiques?

        // ==== Token directement générer pour éviter la double connexion ====
        const token = await generateToken({
            user_id: newUser.user_id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        });


        return res.status(201).location(`/api/auth/${newUser.username}`).json({
            message: "User created successfully.",
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                token
            }
        });
    },
    updatePwd: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { email, oldPassword, newPassword } = req.body;

        // ==== Vérifier si l'utilisateur existe ====
        const userFound = await db.User.findOne({ where: { email } });
        // Si non → erreur 400
        if (!userFound) {
            throw createHttpError(404, "Utilisateur non trouvé.")
        };

        // ==== Vérifier si le mdp est valide ====
        const isValid = await verify(userFound.password, oldPassword);
        if (!isValid) {
            throw createHttpError(401, "Ancien password incorrect.")
        }

        // ==== Hasher le nouveau mot de passe ====
        const hashNewPwd = await hash(newPassword);

        // ==== Stocker le nouveau mdp ====
        userFound.password = hashNewPwd;

        // ==== Le sauver en db ====
        await userFound.save();

        return res.status(200).json({ message: "Password has been changed successfully." })
    }
}

export default authController;