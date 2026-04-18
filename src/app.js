import express from "express";
import morgan from "morgan";
import apiRouter from "./routers/index.js";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

process.on("uncaughtException", (err) => {
    console.error("uncaughtException:", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    console.error("unhandledRejection:", reason);
    process.exit(1);
});

// ==== Setup ====
const { PORT, NODE_ENV } = process.env;
const app = express();
app.set("trust proxy", 1); // faire confiance au proxy railway

// ==== Middlewares transport  ====
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "100kb" }));

// ==== Middlewares sécurité ====
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

// ==== Routing ====
app.use("/api", apiRouter);

// ==== Middlewares errors ====
app.use(errorHandler);

// ==== Server ====
app.listen(PORT, (error) => {
    if (error) {
        console.log("Failure to start server", error);
        return;
    };

    console.log(`Web api running on:`, `http://localhost:${PORT}`, `[${NODE_ENV}]`);
});

export default app;