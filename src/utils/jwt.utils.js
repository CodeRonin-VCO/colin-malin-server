import jwt from "jsonwebtoken";

export function generateToken({ user_id, username, role }) {
    
    // ==== Ecriture sous forme de promesse ====
    return new Promise( (resolve, reject) => {
        const data = { user_id, username, role }; // données du token
        const secretKey = process.env.JWT_SECRET; // clef secrète pour la signature

        // ==== Config token ====
        const option = {
            algorithm: "HS512",
            expiresIn: "1h", //vercel/ms
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE
        }

        // ==== Générer le token ====
        jwt.sign(data, secretKey, option, (error, token) => {
            if (error) {
                reject(new Error("Token not generated"));
                return;
            }
            resolve(token);
        });
    });
}

export function decodeToken(token) {

    // ==== Ecriture sous forme de promesse ====
    return new Promise((resolve, reject) => {

        const secretKey = process.env.JWT_SECRET // Clef secret pour la signature du token

        // ==== Option de validation ====
        const options = {
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE
        }

        // ==== Vérification du token ====
        jwt.verify(token, secretKey, options, (error, data) => {
            if(error) {
                reject(error);
                return;
            }

            resolve(data);
        });
    });
}