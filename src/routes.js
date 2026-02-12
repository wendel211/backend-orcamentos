import express from "express";
import pool from "./db.js";

const router = express.Router();

/* ===========================
   BUDGETS
=========================== */

// Criar orçamento
router.post("/budgets", async (req, res) => {
    const { title, client_name, address, discount, extra_fee } = req.body;

    const result = await pool.query(
        `INSERT INTO budgets (title, client_name, address, discount, extra_fee)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
        [title, client_name, address, discount || 0, extra_fee || 0]
    );

    res.json(result.rows[0]);
});

// Listar orçamentos
router.get("/budgets", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM budgets ORDER BY created_at DESC"
    );
    res.json(result.rows);
});

// Buscar orçamento
router.get("/budgets/:id", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM budgets WHERE id = $1",
        [req.params.id]
    );
    res.json(result.rows[0]);
});

// Deletar orçamento
router.delete("/budgets/:id", async (req, res) => {
    await pool.query("DELETE FROM budgets WHERE id = $1", [req.params.id]);
    res.json({ success: true });
});

/* ===========================
   ITEMS
=========================== */

// Criar item
router.post("/items", async (req, res) => {
    const { budget_id, type, name, qty, unit_price } = req.body;

    const result = await pool.query(
        `INSERT INTO items (budget_id, type, name, qty, unit_price)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
        [budget_id, type, name, qty, unit_price]
    );

    res.json(result.rows[0]);
});

// Listar itens de um orçamento
router.get("/items/:budgetId", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM items WHERE budget_id = $1",
        [req.params.budgetId]
    );

    res.json(result.rows);
});

export default router;
