import pool from "../db.js";

export async function createItem(req, res) {
    const { budget_id, type, name, qty, unit_price } = req.body;

    if (!budget_id || !type || !name) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const result = await pool.query(
        `INSERT INTO items (budget_id, type, name, qty, unit_price)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
        [budget_id, type, name, qty, unit_price]
    );

    res.status(201).json(result.rows[0]);
}

export async function listItems(req, res) {
    const result = await pool.query(
        "SELECT * FROM items WHERE budget_id = $1",
        [req.params.budgetId]
    );

    res.json(result.rows);
}
