//Appliquer le Rate Limiter Global dans app.ts

import express from "express";
import { globalLogger } from "./middlewares/globalLogger";
import { globalRateLimiter } from "./middlewares/globalRateLimiter";

const app = express();

// Appliquer le rate limiter global à toutes les routes
app.use(globalRateLimiter);

// Autres middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;

// Appliquer le logger global
app.use(globalLogger);
