import pool from "../db.js";

/* ============================
   UPDATE BUDGET
============================ */

export async function updateBudget(req, res) {
    const { id } = req.params;
    const { title, client_name, address, discount, extra_fee } = req.body;
    const now = new Date().toISOString();

    const result = await pool.query(
        `UPDATE budgets SET
            title = COALESCE($1, title),
            client_name = COALESCE($2, client_name),
            address = $3,
            discount = COALESCE($4, discount),
            extra_fee = COALESCE($5, extra_fee),
            updated_at = $6
        WHERE id = $7 AND deleted_at IS NULL
        RETURNING *`,
        [title, client_name, address ?? null, discount, extra_fee, now, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Orçamento não encontrado" });
    }

    res.json(result.rows[0]);
}

/* ============================
   SOFT DELETE BUDGET
============================ */

export async function deleteBudget(req, res) {
    const { id } = req.params;
    const now = new Date().toISOString();

    const result = await pool.query(
        `UPDATE budgets SET
            deleted_at = $1,
            updated_at = $1
        WHERE id = $2 AND deleted_at IS NULL
        RETURNING id`,
        [now, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Orçamento não encontrado" });
    }

    // Also soft-delete related items
    await pool.query(
        `UPDATE items SET
            deleted_at = $1,
            updated_at = $1
        WHERE budget_id = $2 AND deleted_at IS NULL`,
        [now, id]
    );

    res.json({ success: true, id: result.rows[0].id });
}

/* ============================
   GET SINGLE BUDGET
============================ */

export async function getBudget(req, res) {
    const { id } = req.params;

    const result = await pool.query(
        `SELECT * FROM budgets WHERE id = $1 AND deleted_at IS NULL`,
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Orçamento não encontrado" });
    }

    res.json(result.rows[0]);
}
