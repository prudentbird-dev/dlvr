import mongoose from "mongoose";

export const initializeDatabase = async (): Promise<void> => {
  mongoose.set("debug", process.env.NODE_ENV === "development");

  await mongoose
    .connect(`${process.env.DB_URL}/dlvr`)
    .then(() => console.log("Database initialized successfully!"))
    .catch(() => console.error("Database connection failed"));
};
