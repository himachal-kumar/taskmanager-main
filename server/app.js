import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

export default app; 