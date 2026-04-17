import { afterAll, afterEach, beforeAll, describe, expect, test } from "@jest/globals";
import app from "../src/app.js";
import request from "supertest";
import db from "./../src/models/index.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { hash } from "argon2";


// todo: edge cases (email mal formatés, mdp trop court)??

// LOGIN
describe("POST /api/auth/login", () => {
    const loginUser = {
        email: "loginUser@exemple.be",
        password: "loginUser=456"
    }

    beforeAll(async () => {
        await db.User.create({
            user_id: uuidv4(),
            username: "loginUser",
            email: "loginUser@exemple.be",
            password: await hash("loginUser=456"),
            role: "user"
        });
    });

    afterAll(async () => {
        const user = await db.User.findOne({ where: { email: loginUser.email } });
        if (user) {
            await user.destroy();
        }
    });

    describe("CAS VALIDES", () => {
        test("renvoie 200 et un message", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send(loginUser);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: "Connected successfully.",
                    token: expect.any(String),
                    user: expect.objectContaining({
                        user_id: expect.any(String),
                        email: loginUser.email,
                        username: expect.any(String),
                        role: expect.any(String),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    })
                })
            )
        });

        test("token valide décodé", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send(loginUser);

            const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
            expect(decoded).toEqual(
                expect.objectContaining({
                    user_id: expect.any(String),
                    username: expect.any(String),
                    role: expect.any(String)
                })
            );
        });
    })

    describe("CAS INVALIDES", () => {
        test("champ manquant → 400", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({});

            expect(res.status).toBe(400);
        });

        test("email inexistant → 401", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "test@exemple.be", password: loginUser.password });

            expect(res.status).toBe(401);
        });

        test("mauvais password → 401", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: loginUser.email, password: "Test=123" });

            expect(res.status).toBe(401);
        });
    })
});

// REGISTER
describe("POST /api/auth/register", () => {
    let email;

    const testUser = {
        username: "Jest",
        email: "jest@exemple.be",
        password: "Jest=456"
    };

    afterEach(async () => {
        if (email) {
            const user = await db.User.findOne({ where: { email } });
            if (user) await user.destroy();
            email = null;
        }
    });

    // Cas valides
    describe("CAS VALIDE", () => {
        test("renvoie 201 et un message", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send(testUser);

            email = "jest@exemple.be";

            expect(res.status).toBe(201);
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: "Utilisateur créé avec succès.",
                    user: expect.objectContaining({
                        username: expect.any(String),
                        email: testUser.email,
                        role: expect.any(String),
                        token: expect.any(String)
                    })
                })
            )
        });

        test("mot de passe hashé", async () => {
            await request(app)
                .post("/api/auth/register")
                .send(testUser);

            email = testUser.email;

            const user = await db.User.findOne({ where: { email } });
            expect(user.password).not.toBe("Jest=456");
        });
    });

    describe("CAS INVALIDES", () => {
        test("champ manquant → 400", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ username: testUser.username, email: testUser.email });

            expect(res.status).toBe(400);
        });

        test("renvoie 400 si l'email est utilisé", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ username: testUser.username, email: "vincent@exemple.be", password: testUser.password });

            expect(res.status).toBe(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: "Cet email est déjà utilisé.",
                })
            )
        });
    });
});

// UPDATE-PWD
describe("POST /api/auth/update-pwd", () => {
    const testUser = {
        email: "testUser@exemple.be",
        oldPassword: "testUser=456",
        newPassword: "testUser=123"
    }

    beforeAll(async () => {
        await db.User.create({
            user_id: uuidv4(),
            username: "testUser",
            email: "testUser@exemple.be",
            password: await hash("testUser=456"),
            role: "user"
        });
    });

    afterAll(async () => {
        const user = await db.User.findOne({ where: { email: testUser.email } });
        if (user) {
            await user.destroy();
        }
    });

    describe("CAS VALIDES", () => {
        afterEach(async () => {
            const user = await db.User.findOne({ where: { email: testUser.email } });
            user.password = await hash(testUser.oldPassword);
            await user.save();
        });

        test("Update password → 200", async () => {
            const res = await request(app)
                .put("/api/auth/update-pwd")
                .send(testUser);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: "Le password a été changé avec succès."
                })
            )
        });

        test("nouveau mot de passe hashé", async () => {
            await request(app)
                .put("/api/auth/update-pwd")
                .send(testUser);

            const user = await db.User.findOne({ where: { email: testUser.email } });
            expect(user.password).not.toBe("testUser=123");
        });
    });

    describe("CAS INVALIDES", () => {
        test("champ manquant → 400", async () => {
            const res = await request(app)
                .put("/api/auth/update-pwd")
                .send({ email: testUser.email, oldPassword: testUser.oldPassword });

            expect(res.status).toBe(400);
        });

        test("utilisateur inexistant → 404", async () => {
            const res = await request(app)
                .put("/api/auth/update-pwd")
                .send({ email: "dunnot@exist.com", oldPassword: testUser.oldPassword, newPassword: testUser.newPassword });

            expect(res.status).toBe(404);
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: "Aucun utilisateur trouvé."
                })
            )
        });

        test("oldPassword invalide → 401", async () => {
            const res = await request(app)
                .put("/api/auth/update-pwd")
                .send({ email: testUser.email, oldPassword: "fakePwd", newPassword: testUser.newPassword });

            expect(res.status).toBe(401);
            expect(res.body).toEqual(
                expect.objectContaining({
                    message: "Ancien password incorrect."
                })
            )
        });
    });
});


afterAll(async () => {
    await db.sequelize.close();
});
