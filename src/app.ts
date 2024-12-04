import express, { Express } from "express";
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
        url: `http://localhost:${PORT}`,
        description: "Development Server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
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
            : `port ${PORT}`
        } in ${process.env.NODE_ENV} mode`,
      );
      console.log(
        `API Documentation available at ${
          process.env.NODE_ENV === "development"
            ? `http://localhost:${PORT}`
            : ""
        }/api/docs`,
      );
    });

    return server;
  } catch (error) {
    console.error("Error initializing server:", error);
    process.exit(1);
  }
};
