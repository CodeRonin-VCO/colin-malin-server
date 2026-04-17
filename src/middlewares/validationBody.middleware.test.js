import { describe, expect, jest, test } from "@jest/globals";
import { validateFields } from "./validationBody.middleware.js";

// Schéma pour les différents cas d'usage à tester
const STRING_SCHEMA = {
    name: { type: "string", required: true, min: 2, max: 10 }
};

const NUMBER_SCHEMA = {
    age: { type: "number", required: true, min: 1, max: 120 }
};

const EMAIL_SCHEMA = {
    email: { type: "email", required: true }
};

const PASSWORD_SCHEMA = {
    password: { type: "password", required: true, min: 2 }
};

const ARRAY_STRING_SCHEMA = {
    arrayString: { type: "array", required: true, min: 1, max: 15, of: "string" },
};

const ARRAY_NUMBER_SCHEMA = {
    arrayNumber: { type: "array", required: true, min: 1, max: 15, of: "number" },
};

const ARRAY_OBJECT_SCHEMA = {
    arrayObject: { type: "array", required: true, min: 1, max: 15, of: "object" },
};

const OBJECT_SCHEMA = {
    object: { type: "object", required: true }
}


describe("validateFields", () => {
    describe("CAS INVALIDES", () => {
        test("vérifier si le champ est obligatoire", () => {
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(STRING_SCHEMA)(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["name est requis."]

                })
            );
        });

        test("String dont la valeur n'est pas un string", () => {
            const req = { body: { name: 123 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(STRING_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["name doit être une chaîne de caractères."]
                })
            );
        });

        test("String qui ne respecte pas la règle min", () => {
            const req = { body: { name: "t" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(STRING_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["name doit avoir au moins 2 caractères."]
                })
            );
        });

        test("String qui ne respecte pas la règle max", () => {
            const req = { body: { name: "test-règles-max" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(STRING_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["name doit avoir au maximum 10 caractères."]
                })
            );
        });

        test("Number dont la valeur n'est pas un number", () => {
            const req = { body: { age: "test" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(NUMBER_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["age doit être un nombre."]
                })
            );
        });

        test("Number qui ne respecte pas la règle min", () => {
            const req = { body: { age: 0 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(NUMBER_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["age doit être >= 1."]
                })
            );
        });

        test("Number qui ne respecte pas la règle max", () => {
            const req = { body: { age: 121 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(NUMBER_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["age doit être <= 120."]
                })
            );
        });

        test("Email dont la valeur n'est pas un string email (regex)", () => {
            const req = { body: { email: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(EMAIL_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["email doit être un email valide."]
                })
            );
        });

        test("Password dont la valeur n'est pas un string", () => {
            const req = { body: { password: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(PASSWORD_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["password doit être une chaîne de caractères."]
                })
            );
        });

        test("Password qui ne respecte pas la règle min", () => {
            const req = { body: { password: "t" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(PASSWORD_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["password doit avoir au moins 2 caractères.", "password doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."]
                })
            );
        });

        test("Password qui ne respecte pas la règle regex", () => {
            const req = { body: { password: "test" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(PASSWORD_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["password doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."]
                })
            );
        });

        test("Array dont la valeur n'est pas un array", () => {
            const req = { body: { arrayString: "test" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(ARRAY_STRING_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["arrayString doit être un tableau."]
                })
            );
        });

        test("Array qui ne respecte pas la règle min", () => {
            const req = { body: { arrayString: [] } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(ARRAY_STRING_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["arrayString doit contenir au moins 1 éléments."]
                })
            );
        });

        test("Array qui ne respecte pas la règle max", () => {
            const req = {
                body: {
                    arrayString: [
                        "Pomme", "Banane", "Cerise", "Datte",
                        "Églantier", "Fraise", "Groseille", "Kiwi",
                        "Litchi", "Mangue", "Nectarine", "Orange",
                        "Poire", "Quetsche", "Raisin", "Tomate"
                    ]
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(ARRAY_STRING_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["arrayString doit contenir au maximum 15 éléments."]
                })
            );
        });

        test("Array qui ne respecte pas la règle of - string", () => {
            const req = { body: { arrayString: [1] } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(ARRAY_STRING_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["arrayString[0] doit être une string."]
                })
            );
        });

        test("Array qui ne respecte pas la règle of - number", () => {
            const req = { body: { arrayNumber: ["Pomme"] } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(ARRAY_NUMBER_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["arrayNumber[0] doit être un nombre."]
                })
            );
        });

        test("Array qui ne respecte pas la règle of - object", () => {
            const req = { body: { arrayObject: ["test"] } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(ARRAY_OBJECT_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["arrayObject[0] doit être un objet."]
                })
            );
        });

        test("Object dont la valeur n'est pas un objet", () => {
            const req = { body: { object: "test" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(OBJECT_SCHEMA)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: ["object doit être un objet."]
                })
            );
        });

        test("schéma multi-champs retourne toutes les erreurs", () => {
            const schema = {
                name: { type: "string", required: true },
                age: { type: "number", required: true }
            };
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(schema)(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    errors: expect.arrayContaining(["name est requis.", "age est requis."])
                })
            );
        });

    })

    describe("CAS VALIDES", () => {
        test("ignorer les champs non fournis (si pas obligatoire)", () => {
            const schema = {
                name: { type: "string" },
                age: { type: "number" }
            };

            const req = { body: { name: "test" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(schema)(req, res, next);

            // Vérifie qu'aucune erreur n'est renvoyée
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();

            // Vérifie que `next()` est appelé
            expect(next).toHaveBeenCalled();

            // Vérifie que `req.body` contient uniquement les champs fournis et validés
            expect(req.body).toEqual({ name: "test" });
        });

        test("utilise req.params comme source", () => {
            const req = { params: { name: "Alice" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(STRING_SCHEMA, "params")(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.params).toEqual({ name: "Alice" });
        });

        test("string valide passe la validation", () => {
            const req = { body: { name: "Test" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(STRING_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("number valide passe la validation", () => {
            const req = { body: { age: 18 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(NUMBER_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("email valide passe la validation", () => {
            const req = { body: { email: "test@exemple.be" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(EMAIL_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("Password valide passe la validation", () => {
            const req = { body: { password: "Test1234!" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(PASSWORD_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("array strings valide passe la validation", () => {
            const req = { body: { arrayString: ["Test"] } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(ARRAY_STRING_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("array numbers valide passe la validation", () => {
            const req = { body: { arrayNumber: [1, 2, 3] } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(ARRAY_NUMBER_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("array objects valide passe la validation", () => {
            const req = {
                body: {
                    arrayObject: [
                        { name: "Jest" },
                        { name: "Express" }
                    ]
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(ARRAY_OBJECT_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("object valide passe la validation", () => {
            const req = { body: { object: { name: "Jest" } } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(OBJECT_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    })

    describe("CAS LIMITES", () => {
        test("String à la borne exacte de min passe la validation", () => {
            const req = { body: { name: "JS" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(STRING_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("String à la borne exacte de max passe la validation", () => {
            const req = { body: { name: "abcdefghij" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(STRING_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("Number à la borne exacte de min passe la validation", () => {
            const req = { body: { age: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(NUMBER_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("Number à la borne exacte de max passe la validation", () => {
            const req = { body: { age: 120 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(NUMBER_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("Array à la borne exacte de min passe la validation", () => {
            const req = { body: { arrayNumber: [1] } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(ARRAY_NUMBER_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("Array à la borne exacte de max passe la validation", () => {
            const req = { body: { arrayNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(ARRAY_NUMBER_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test("les champs hors schéma sont filtrés de req.body", () => {
            const req = { body: { name: "Alice", injectedField: "hack" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateFields(STRING_SCHEMA)(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.body).toEqual({ name: "Alice" });
            expect(req.body.injectedField).toBeUndefined();
        });
    })
})

