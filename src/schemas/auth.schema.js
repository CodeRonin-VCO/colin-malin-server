export const LOGIN_SCHEMA = Object.freeze({
    email: { type: "string", min: 2, max: 150, required: true },
    password: { type: "string", required: true }
});

export const REGISTER_SCHEMA = Object.freeze({
    username: { type: "string", min: 2, max: 100, required: true },
    email: { type: "string", min: 2, max: 150, required: true },
    password: { type: "password", min: 8, required: true }
});

export const UPDATE_PASSWORD_SCHEMA = Object.freeze({
    email: { type: "string", min: 2, max: 150, required: true },
    oldPassword: { type: "string", required: true },
    newPassword: { type: "password", min: 8, required: true }
});