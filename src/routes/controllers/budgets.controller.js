import pool from "../db.js";

export async function createBudget(req, res) {
    const { title, client_name, address, discount, extra_fee } = req.body;

    if (!title || !client_name) {
        return res.status(400).json({ error: "title e client_name são obrigatórios" });
    }

    const result = await pool.query(
        `INSERT INTO budgets (title, client_name, address, discount, extra_fee)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
        [title, client_name, address, discount || 0, extra_fee || 0]
    );

    res.status(201).json(result.rows[0]);
}

export async function listBudgets(req, res) {
    const result = await pool.query(
        "SELECT * FROM budgets ORDER BY created_at DESC"
    );
    res.json(result.rows);
}

export async function getBudget(req, res) {
    const result = await pool.query(
        "SELECT * FROM budgets WHERE id = $1",
        [req.params.id]
    );

    if (!result.rows.length) {
        return res.status(404).json({ error: "Orçamento não encontrado" });
    }

    res.json(result.rows[0]);
}

export async function deleteBudget(req, res) {
    await pool.query("DELETE FROM budgets WHERE id = $1", [req.params.id]);
    res.json({ success: true });
}
