import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import syncRoutes from "./routes/sync.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { checkApiKey } from "./middlewares/auth.middleware.js"; // 1. Importar o middleware

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rota pública (Status) - Deixamos sem trava para conferir se o app está online
app.get("/", (req, res) => {
    res.json({ status: "API Sync Offline-First funcionando" });
});

// 2. Aplicar a trava nas rotas privadas
// A partir daqui, todas as requisições precisam da chave no Header
app.use("/api/sync", checkApiKey, syncRoutes);
app.use("/api/budgets", checkApiKey, budgetRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});