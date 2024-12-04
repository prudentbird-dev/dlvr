import { startServer } from "./app";

if (process.env.NODE_ENV !== "test") {
  startServer();
}
