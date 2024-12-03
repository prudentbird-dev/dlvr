import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import apiRoutes from "./routes/index";
import { initializeDatabase } from "./config/database.config";
import errorHandler from "./middlewares/errorHandler.middleware";

dotenv.config();

const app = express();
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

(async () => {
  try {
    // Initialize the database
    await initializeDatabase();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(
        `API Documentation available at http://localhost:${PORT}/api/docs`,
      );
    });
  } catch (error) {
    console.error("Error initializing server:", error);
    process.exit(1);
  }
})();
