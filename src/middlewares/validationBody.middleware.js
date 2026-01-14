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
export const validateFields = (schema, source = "body") => (req, res, next) => {
    const data = req[source];
    const errors = [];
    const validatedData = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    for (const field in schema) {
        const rules = schema[field];
        const value = data[field];

        // Vérifier si le champ est obligatoire
        if (rules.required && (value === undefined || value === null || value === "")) {
            errors.push(`${field} est requis.`);
            continue;
        }

        // Ignorer les champs non fournis (si pas obligatoire)
        if (value === undefined || value === null || value === "") continue;

        // --- Type string
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

        // --- Type number
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

        // --- Type email
        if (rules.type === "email") {
            if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors.push(`${field} doit être un email valide.`);
            }
        }

        // --- Type password
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

        // --- Type array
        if (rules.type === "array") {
            if (!Array.isArray(value)) {
                errors.push(`${field} doit être un tableau.`);
                continue;
            }
            if (rules.min !== undefined && value.length < rules.min) {
                errors.push(`${field} doit contenir au moins ${rules.min} éléments.`);
            }

            if (rules.max !== undefined && value.length > rules.max) {
                errors.push(`${field} doit contenir au maximum ${rules.max} éléments.`);
            }
            if (rules.of) {
                value.forEach((item, index) => {
                    if (rules.of === "string" && typeof item !== "string") {
                        errors.push(`${field}[${index}] doit être une string.`);
                    }
                    if (rules.of === "number" && typeof item !== "number") {
                        errors.push(`${field}[${index}] doit être un nombre.`);
                    }
                    if (rules.of === "object" && typeof item !== "object") {
                        errors.push(`${field}[${index}] doit être un objet.`);
                    }
                });
            }
        }

        // --- Type object
        if (rules.type === "object" && typeof value !== "object") {
            errors.push(`${field} doit être un objet.`);
        }

        // Ajouter champ validé
        validatedData[field] = value;
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Remplacer req.body par les champs validés
    req[source] = validatedData;

    next();
};
