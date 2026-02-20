import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
// Adicione as importações das funções que faltam
import {
    updateBudget,
    deleteBudget,
    getBudget,
    listBudgets,   // Verifique se este é o nome no seu controller
    createBudget   // Verifique se este é o nome no seu controller
} from "../controllers/budget.controller.js";

const router = express.Router();

// Rotas Gerais (Para listar e criar)
router.get("/", asyncHandler(listBudgets));  // Acessível em /api/budgets
router.post("/", asyncHandler(createBudget)); // Acessível em /api/budgets

router.get("/:id", asyncHandler(getBudget));
router.put("/:id", asyncHandler(updateBudget));
router.delete("/:id", asyncHandler(deleteBudget));

export default router;