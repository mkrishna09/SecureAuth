import express from "express";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./shared/errors/errorHandler";
import { AppError } from "./shared/errors/AppError";
import { registerSchema } from "./modules/auth/auth.validation";
import {z} from "zod";
import { validate } from "./middleware/validate";
import authRoutes from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";



const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(compression());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "OK",
      message: "SecureAuth API is running",
    },
  });
});

app.get("/error", (_req, _res) => {
  throw new AppError("This is a test error", 400);
});

app.use("/api/v1/auth", authRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(errorHandler);

export default app;