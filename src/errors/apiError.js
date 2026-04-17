export default class ApiError extends Error {
    constructor(statusCode, message, expose = statusCode < 500) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.expose = expose;
    }
}