import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import errorHandler from "./errorHandler.middleware.js";


describe("errorHandler [prod]", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });

    let req, res, next;

    beforeEach(() => {
        process.env.NODE_ENV = "prod";
        req = { method: "GET", originalUrl: "/test" };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test("retourne 404 avec le bon message si expose est true", () => {
        const error = {
            name: "ApiError",
            message: "Not found",
            statusCode: 404,
            expose: true,
            stack: "stack trace"
        };

        errorHandler(error, req, res, next);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Not found"
            })
        );

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("statusCode depuis error.status si pas de statusCode", () => {
        const error = {
            name: "ApiError",
            message: "Not found",
            status: 404,
            expose: true,
            stack: "stack trace"
        };

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("statusCode 500 par défaut", () => {
        const error = {
            name: "ApiError",
            message: "Not found",
            expose: true,
            stack: "stack trace"
        };

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    test("message 'Internal server error' si expose false", () => {
        const error = {
            name: "ApiError",
            message: "Service unavailable",
            statusCode: 503,
            expose: false,
            stack: "stack trace"
        };

        errorHandler(error, req, res, next);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Internal server error"
            })
        );

        expect(res.status).toHaveBeenCalledWith(503);
    });

    test("message 'Internal server error' si expose undefined", () => {
        const error = {
            name: "ApiError",
            message: "Service unavailable",
            statusCode: 503,
            expose: undefined,
            stack: "stack trace"
        };

        errorHandler(error, req, res, next);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Internal server error"
            })
        );

        expect(res.status).toHaveBeenCalledWith(503);
    });
})

describe("errorHandler [dev]", () => {
    let req, res, next;

    beforeEach(() => {
        process.env.NODE_ENV = "dev";
        req = { method: "GET", originalUrl: "/test" };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        process.env.NODE_ENV = "prod"; // remettre la valeur originale
    });

    test("retourne statusCode, name, message et stack en mode dev", () => {
        const error = {
            name: "ApiError",
            message: "Not found",
            statusCode: 404,
            expose: true,
            stack: "stack trace"
        };

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 404,
                name: "ApiError",
                message: "Not found",
                stack: "stack trace"
            })
        );
    });
});