/**
 * Middleware générique de validation
 * @param {Object} schema - définition des champs et de leur validation
 *    ex: {
 *      firstName: { type: "string", min: 2, max: 255 },
 *      email: { type: "email" },
 *      password: { type: "password", min: 8, required: true },
 *      age: { type: "number", min: 0 }
 *    }
 */
export const validateFields = (schema) => (req, res, next) => {
    const errors = [];
    const validatedData = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    for (const field in schema) {
        const rules = schema[field];
        const value = req.body[field];

        // Vérifier si le champ est obligatoire
        if (rules.required && (value === undefined || value === null || value === "")) {
            errors.push(`${field} est requis.`);
            continue;
        }

        // Ignorer les champs non fournis (si pas obligatoire)
        if (value === undefined || value === null || value === "") continue;

        // Type string
        if (rules.type === "string") {
            if (typeof value !== "string") {
                errors.push(`${field} doit être une chaîne de caractères.`);
                continue;
            }
            if (rules.min && value.length < rules.min) {
                errors.push(`${field} doit avoir au moins ${rules.min} caractères.`);
            }
            if (rules.max && value.length > rules.max) {
                errors.push(`${field} doit avoir au maximum ${rules.max} caractères.`);
            }
        }

        // Type number
        if (rules.type === "number") {
            if (typeof value !== "number") {
                errors.push(`${field} doit être un nombre.`);
                continue;
            }
            if (rules.min !== undefined && value < rules.min) {
                errors.push(`${field} doit être >= ${rules.min}.`);
            }
            if (rules.max !== undefined && value > rules.max) {
                errors.push(`${field} doit être <= ${rules.max}.`);
            }
        }

        // Type email
        if (rules.type === "email") {
            if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors.push(`${field} doit être un email valide.`);
            }
        }

        // Type password
        if (rules.type === "password") {
            if (typeof value !== "string") {
                errors.push(`${field} doit être une chaîne de caractères.`);
                continue;
            }
            if (rules.min && value.length < rules.min) {
                errors.push(`${field} doit avoir au moins ${rules.min} caractères.`);
            }
            if (!passwordRegex.test(value)) {
                errors.push(
                    `${field} doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.`
                );
            }
        }

        // Ajouter champ validé
        validatedData[field] = value;
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Remplacer req.body par les champs validés
    req.body = validatedData;

    next();
};
