import { decodeToken } from "../utils/jwt.utils.js";


export function authentificationMiddleware() {
    
    return async (req, res, next) => {
        // ==== Récupérer les données d'identification ====
        const authData = req.headers["authorization"] ?? "";

        // ==== Extraire le token ====
        const [prefix, token] = authData.split(" ");

        // Si non → reject
        if(prefix?.toLowerCase() !== "bearer" || !token) {
            req.user = null;
            
            next();

            return;
        };

        // Si oui → obtenir les données du token et autoriser l'accès
        try {
            req.user = await decodeToken(token);

        } catch {
            req.user = null;
            return res.status(401).json({ message: "Invalid or expired token." });
        }

        next();
    }
}

export function authorizedMiddleware(...roles) {
    
    return (req, res, next) => {
        // ==== User isConnected? ====
        if (!req.user) {
            res.sendStatus(401);
            return;
        }

        // todo: S'il y a un rôle (admin/client/...) :
        if(roles.length && !roles.includes(req.user.role)) {
            res.sendStatus(403); // forbiden
            return;
        }

        next();
    }
}