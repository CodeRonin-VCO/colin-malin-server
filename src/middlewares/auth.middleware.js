import ApiError from "../errors/auth.errors.js";
import { decodeToken } from "../utils/jwt.utils.js";


export function authentificationMiddleware() {
    return async (req, res, next) => {
        // ==== Récupérer les données d'identification ====
        const authData = req.headers["authorization"] ?? "";

        if (!authData) {
            req.user = null;
            return next();
        }

        // ==== Extraire le token ====
        const [prefix, token] = authData.split(" ");

        // Si non → reject
        if (prefix?.toLowerCase() !== "bearer" || !token) {
            req.user = null;
            return next();
        };

        // Si oui → obtenir les données du token et autoriser l'accès
        try {
            req.user = await decodeToken(token);
            next();


        } catch {
            throw new ApiError(401, "Invalid or expired token.");
        }
    }
}

export function authorizedMiddleware(...roles) {
    return (req, res, next) => {
        // ==== User isConnected? ====
        if (!req.user) {
            throw new ApiError(401, "Non authentifié.")
        }

        // todo: S'il y a un rôle (admin/client/...) :
        if (roles.length && !roles.includes(req.user.role)) {
            throw new ApiError(403, "Accès interdit.")
        }

        next();
    }
}