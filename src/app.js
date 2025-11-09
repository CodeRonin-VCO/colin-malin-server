import express from "express";
import morgan from "morgan";
import apiRouter from "./routers/index.js";
import cors from "cors";

// ==== Setup ====
const { PORT, NODE_ENV } = process.env;
const app = express();

// ==== Global middlewares ====
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// ==== Routing ====
app.use("/api", apiRouter);

// ==== Middlewares errors ====
app.use((error, req, res, next) => {
    console.log('Erreur : ' + error.cause);

    if (NODE_ENV === "dev") {
        res.status(500).json({
            name: error.name,
            message: error.message || "Aucun message",
            content: error.stack
        })
    } else {
        res.status(500).json({
            message: `Une erreur s'est produite en production. Type d'erreur : ${error.name}`
        })
    };
});

// ==== Server ====
app.listen(PORT, (error) => {
    if (error) {
        console.log("Failure to start server", error);
        return;
    };

    console.log(`Web api running on:`, `http://localhost:${PORT}`, `[${NODE_ENV}]`);
})