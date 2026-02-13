import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import syncRoutes from "./routes/sync.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/sync", syncRoutes);
app.use("/api/budgets", budgetRoutes);

app.get("/", (req, res) => {
    res.json({ status: "API Sync Offline-First funcionando" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
