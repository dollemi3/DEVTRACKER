import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import profileRouter from "./routes/profile.js";
import projectRoutes from './routes/project.js';
import codeSnippetRoutes from "./routes/codeSnippet.js";
import calendarRoutes from "./routes/calendar.js";
import taskRoutes from "./routes/task.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRouter);
app.use('/api/project', projectRoutes);
app.use("/api/snippet", codeSnippetRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/task", taskRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
    res.send("백엔드 서버 작동 중 🚀");
});
