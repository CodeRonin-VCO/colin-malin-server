import { hash, verify } from "argon2";
import { generateToken } from "../utils/jwt.utils.js";
import { v4 as uuidv4 } from 'uuid';
import db from "./../models/index.js";


const authController = {
    login: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { email, password } = req.body;

        // ==== Vérifier si champs sont remplis ====
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required." })
            return;
        };

        try {
            // ==== Vérifier si l'utilisateur existe ====
            const userFound = await db.User.findOne({ where: { email } });
            // Si non → erreur 400
            if (!userFound) {
                res.status(401).json({ error: "Credential invalid." })
                return;
            };

            // Si oui → validation
            const isPasswordValid = await verify(userFound.password, password);
            if (!isPasswordValid) {
                res.status(401).json({ message: "Credential invalid." });
                return;
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

        } catch (error) {
            console.error("Login error", error, {
                error: error.message,
                stack: error.stack,
                email: email
            });
            res.status(500).json({ message: "An error occurred during login." });

            return;
        }
    },
    register: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { username, email, password } = req.body;

        // ==== Vérifier si champs sont remplis ====
        if (!username || !email || !password) {
            res.status(400).json({ message: "Fields (username, email or password) are required." })
            return;
        };

        // ==== Validation mot de passe (règles de sécurité) ====
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters, one uppercase letter, one number, and one special character."
            });
        };

        try {
            // ==== Vérifier si l'utilisateur existe déjà ====
            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser) {
                res.status(400).json({ message: "This email is already in use." })
                return;
            }

            // ==== Création d'un nouvel utilisateur ====
            const newUser = await db.User.create({
                user_id: uuidv4(),
                username,
                email,
                password: await hash(password),
                role: "user"
            });

            // todo: rendre les rôles dynamiques

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

        } catch (error) {
            console.error("Error creating new user", error);
            res.status(500).json({ message: "Error creating new user.", error: error.message })
            return;
        };
    },
    updatePwd: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { email, oldPassword, newPassword } = req.body;
        console.log(req.body)

        // ==== Vérifier si champs sont remplis ====
        if (!email || !oldPassword || !newPassword) {
            res.status(400).json({ message: "Email, old password and new password are required." });
            return;
        };

        try {
            // ==== Vérifier si l'utilisateur existe ====
            const userFound = await db.User.findOne({ where: { email } });
            // Si non → erreur 400
            if (!userFound) {
                return res.status(400).json({ error: "User not found !" })
            };

            // ==== Vérifier si le mdp est valide ====
            const isValid = await verify(userFound.password, oldPassword);
            if (!isValid) {
                return res.status(401).json({ message: "Old password is incorrect." });
            }

            // ==== Hasher le nouveau mot de passe ====
            const hashNewPwd = await hash(newPassword);

            // ==== Stocker le nouveau mdp ====
            userFound.password = hashNewPwd;

            // ==== Le sauver en db ====
            await userFound.save();

            return res.status(200).json({ message: "Password has been changed successfully." })

        } catch (error) {
            console.error("Error updating password", error);
            res.status(500).json({ message: "An error occurred while updating the password." });
            return;
        }
    }
}

export default authController;