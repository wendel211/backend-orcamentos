import pool from "../db.js";

/* ============================
   LIST ALL BUDGETS (Adicionado)
============================ */
export async function listBudgets(req, res) {
    // Busca todos os orçamentos que não foram excluídos
    const result = await pool.query(
        `SELECT * FROM budgets WHERE deleted_at IS NULL ORDER BY created_at DESC`
    );
    res.json(result.rows);
}

/* ============================
   CREATE / SYNC BUDGET (Adicionado)
============================ */
export async function createBudget(req, res) {
    const { id, title, client_name, address, discount, extra_fee, status, created_at, updated_at } = req.body;

    // Como é Offline-First, o ID pode vir do celular (UUID)
    // Usamos ON CONFLICT para caso o orçamento já tenha sido enviado antes
    const result = await pool.query(
        `INSERT INTO budgets (id, title, client_name, address, discount, extra_fee, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            client_name = EXCLUDED.client_name,
            address = EXCLUDED.address,
            discount = EXCLUDED.discount,
            extra_fee = EXCLUDED.extra_fee,
            status = EXCLUDED.status,
            updated_at = EXCLUDED.updated_at
         RETURNING *`,
        [id, title, client_name, address ?? null, discount || 0, extra_fee || 0, status || 'pending', created_at, updated_at]
    );

    res.status(201).json(result.rows[0]);
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

/* ============================
   UPDATE BUDGET
============================ */
export async function updateBudget(req, res) {
    const { id } = req.params;
    const { title, client_name, address, discount, extra_fee, status } = req.body;
    const now = new Date().toISOString();

    const result = await pool.query(
        `UPDATE budgets SET
            title = COALESCE($1, title),
            client_name = COALESCE($2, client_name),
            address = $3,
            discount = COALESCE($4, discount),
            extra_fee = COALESCE($5, extra_fee),
            status = COALESCE($6, status),
            updated_at = $7
        WHERE id = $8 AND deleted_at IS NULL
        RETURNING *`,
        [title, client_name, address ?? null, discount, extra_fee, status, now, id]
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

    // Também deleta os itens relacionados
    await pool.query(
        `UPDATE items SET
            deleted_at = $1,
            updated_at = $1
        WHERE budget_id = $2 AND deleted_at IS NULL`,
        [now, id]
    );

    res.json({ success: true, id: result.rows[0].id });
}