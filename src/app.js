import express from "express";
import morgan from "morgan";
import apiRouter from "./routers/index.js";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.middleware.js";

// ==== Setup ====
const { PORT, NODE_ENV } = process.env;
const app = express();

// ==== Global middlewares ====
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

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
})