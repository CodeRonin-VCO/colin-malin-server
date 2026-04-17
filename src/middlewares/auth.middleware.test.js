import { afterEach, describe, expect, jest, test } from "@jest/globals";

jest.unstable_mockModule("../utils/jwt.utils.js", () => ({
    decodeToken: jest.fn()
}));

const { authentificationMiddleware, authorizedMiddleware } = await import("./auth.middleware.js");
const jwtUtils = await import("../utils/jwt.utils.js");


afterEach(() => {
    jwtUtils.decodeToken.mockClear();
});

describe("authorizedMiddleware", () => {
    test("appelle next() si user connecté et aucun rôle requis", () => {
        const req = { user: { user_id: "123", role: "user" } };
        const res = {};
        const next = jest.fn();

        authorizedMiddleware()(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("appelle next() si le rôle correspond", () => {
        const req = { user: { user_id: "123", role: "admin" } };
        const res = {};
        const next = jest.fn();

        authorizedMiddleware("admin")(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("appelle next() si le rôle est dans la liste des rôles autorisés", () => {
        const req = { user: { user_id: "123", role: "user" } };
        const res = {};
        const next = jest.fn();

        authorizedMiddleware("admin", "user")(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    // Cas invalides — throw attendu
    test("lance une erreur 401 si req.user est null", () => {
        const req = { user: null };
        const res = {};
        const next = jest.fn();

        expect(() => authorizedMiddleware()(req, res, next)).toThrow("Non authentifié.");
    });

    test("lance une erreur 403 si le rôle ne correspond pas", () => {
        const req = { user: { user_id: "123", role: "user" } };
        const res = {};
        const next = jest.fn();

        expect(() => authorizedMiddleware("admin")(req, res, next)).toThrow("Accès interdit.");
    });
})

describe("authentificationMiddleware", () => {
    test("Pas de header Authorization", async () => {
        const req = { headers: {}, user: { user_id: "123", role: "user" } };
        const res = {};
        const next = jest.fn();

        await authentificationMiddleware()(req, res, next);

        expect(req.user).toBe(null);
        expect(next).toHaveBeenCalled();
    });

    test("Header mal formé (pas de Bearer)", async () => {
        const req = { headers: { "authorization": " deokfoekofkeogkrok" }, user: { user_id: "123", role: "user" } };
        const res = {};
        const next = jest.fn();

        await authentificationMiddleware()(req, res, next);

        expect(req.user).toBe(null);
        expect(next).toHaveBeenCalled();
    });

    test("Token valide", async () => {
        const req = { headers: { "authorization": "Bearer deokfoekofkeogkrok" }, user: { user_id: "123", role: "user" } };
        const res = {};
        const next = jest.fn();

        jwtUtils.decodeToken.mockResolvedValueOnce({ user_id: "123", role: "user" });
        await authentificationMiddleware()(req, res, next);

        expect(jwtUtils.decodeToken).toHaveBeenCalledWith("deokfoekofkeogkrok");
        expect(req.user).toEqual({ user_id: "123", role: "user" });
        expect(next).toHaveBeenCalled();
    });

    test("Token invalide/expiré", async () => {
        const req = { headers: { "authorization": "Bearer deokfoekofkeogkrok" }, user: { user_id: "123", role: "user" } };
        const res = {};
        const next = jest.fn();

        jwtUtils.decodeToken.mockRejectedValueOnce(new Error("Token expiré"));
        await expect(authentificationMiddleware()(req, res, next)).rejects.toThrow("Invalid or expired token.");

        expect(next).not.toHaveBeenCalled();
    });
})