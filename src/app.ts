import express, { Express } from "express";
import { Request, Response } from "express";
import httpStatus from "http-status";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import apiRoutes from "./routes/index";
import { initializeDatabase } from "./config/database.config";
import errorHandler from "./middlewares/errorHandler.middleware";

dotenv.config();

export const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const PRODUCTION_URL = process.env.PRODUCTION_URL || "";

app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).send({
    message:
      "Welcome to the DLVR API! Use the appropriate endpoints to access the resources.",
    documentation: `API Documentation available at ${
      process.env.NODE_ENV === "development"
        ? `http://localhost:${PORT}/api/docs`
        : PRODUCTION_URL
          ? `${PRODUCTION_URL}/api/docs`
          : "/api/docs"
    }`,
  });
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DLVR Assessment Logistics API",
      version: "1.0.0",
      description: "API for managing dispatch riders and orders",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "development"
            ? `http://localhost:${PORT}`
            : PRODUCTION_URL,
        description:
          process.env.NODE_ENV === "development"
            ? "Development Server"
            : "Production Server",
      },
    ],
  },
  apis:
    process.env.NODE_ENV === "production"
      ? ["./routes/*.js", "./models/*.js"]
      : ["./src/routes/*.ts", "./src/models/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes);
app.use(errorHandler);

export const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== "test") {
      await initializeDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(
        `Server is running on ${
          process.env.NODE_ENV === "development"
            ? `http://localhost:${PORT}`
            : PRODUCTION_URL
              ? `${PRODUCTION_URL}`
              : `port ${PORT}`
        } in ${process.env.NODE_ENV} mode`,
      );
      console.log(
        `API Documentation available at ${
          process.env.NODE_ENV === "development"
            ? `http://localhost:${PORT}/api/docs`
            : PRODUCTION_URL
              ? `${PRODUCTION_URL}/api/docs`
              : "/api/docs"
        }`,
      );
    });

    return server;
  } catch (error) {
    console.error("Error initializing server:", error);
    process.exit(1);
  }
};
