import * as authService from "./../services/auth.service.js";

const authController = {
    login: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);

        return res.status(200).location(`/api/auth/${user.email}`).json({
            message: "Connected successfully.",
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                username: user.username,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    },
    register: async (req, res) => {
        // ==== Récupérer les données entrées ====
        const { username, email, password } = req.body;
        const { newUser, token } = await authService.register(username, email, password);

        return res.status(201).location(`/api/auth/${newUser.username}`).json({
            message: "Utilisateur créé avec succès.",
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
        await authService.updatePwd(email, oldPassword, newPassword);
        
        return res.status(200).json({ message: "Le password a été changé avec succès." })
    }
}

export default authController;