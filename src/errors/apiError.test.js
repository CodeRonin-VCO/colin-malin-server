import { describe, expect, test } from "@jest/globals";
import ApiError from "./apiError.js";


describe("ApiError", () => {
    test("ApiError est une instance de Error", () => {
        const err = new ApiError(404, 'Not Found');
        expect(err).toBeInstanceOf(Error);
    });

    test("ApiError a les bonnes propriétés", () => {
        const err = new ApiError(404, "Not found");
        expect(err.name).toBe("ApiError");
        expect(err.message).toBe("Not found");
        expect(err.statusCode).toBe(404);
        expect(err.expose).toBe(true);
    });

    test("ApiError expose false si erreurs 500+", () => {
        const err = new ApiError(500, "Erreur serveur");
        expect(err.expose).toBe(false);
    })

    test("ApiError expose forcé", () => {
        const err = new ApiError(500, "Erreur serveur", true);
        expect(err.expose).toBe(true);
    })
})