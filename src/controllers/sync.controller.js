import pool from "../db.js";

/* ============================
   UPSERT BUDGET
============================ */

async function upsertBudget(budget, userId) {
    const {
        id,
        title,
        client_name,
        address,
        discount,
        extra_fee,
        created_at,
        updated_at,
        deleted_at,
        status
    } = budget;

    await pool.query(
        `
    INSERT INTO budgets
    (id, user_id, title, client_name, address, discount, extra_fee, created_at, updated_at, deleted_at, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT (id)
    DO UPDATE SET
      title = EXCLUDED.title,
      client_name = EXCLUDED.client_name,
      address = EXCLUDED.address,
      discount = EXCLUDED.discount,
      extra_fee = EXCLUDED.extra_fee,
      updated_at = EXCLUDED.updated_at,
      deleted_at = EXCLUDED.deleted_at,
      status = EXCLUDED.status
    `,
        [id, userId, title, client_name, address, discount, extra_fee, created_at, updated_at, deleted_at, status ?? 'EM_ANALISE']
    );
}

/* ============================
   UPSERT ITEM
============================ */

async function upsertItem(item, userId) {
    const {
        id,
        budget_id,
        type,
        name,
        qty,
        unit_price,
        created_at,
        updated_at,
        deleted_at
    } = item;

    await pool.query(
        `
    INSERT INTO items
    (id, user_id, budget_id, type, name, qty, unit_price, created_at, updated_at, deleted_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    ON CONFLICT (id)
    DO UPDATE SET
      type = EXCLUDED.type,
      name = EXCLUDED.name,
      qty = EXCLUDED.qty,
      unit_price = EXCLUDED.unit_price,
      updated_at = EXCLUDED.updated_at,
      deleted_at = EXCLUDED.deleted_at
    `,
        [id, userId, budget_id, type, name, qty, unit_price, created_at, updated_at, deleted_at]
    );
}

/* ============================
   SYNC PUSH
============================ */

export async function syncPush(req, res) {
    const { budgets = [], items = [], userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "O campo 'userId' é obrigatório no corpo da requisição (syncPush)" });
    }

    for (const budget of budgets) {
        try {
            budget.address = budget.address ?? null;
            budget.deleted_at = budget.deleted_at ?? null;
            await upsertBudget(budget, userId);
        } catch (error) {
            console.error(`Erro ao sincronizar budget ${budget.id}:`, error);
        }
    }

    for (const item of items) {
        try {
            item.deleted_at = item.deleted_at ?? null;
            await upsertItem(item, userId);
        } catch (error) {
            console.error(`Erro ao sincronizar item ${item.id}:`, error);
        }
    }

    res.json({ success: true });
}

/* ============================
   SYNC PULL (INCREMENTAL)
============================ */

export async function syncPull(req, res) {
    const { since, userId } = req.query;

    console.log(`Sync Pull requested for user ${userId} since: ${since}`);

    if (!since) {
        return res.status(400).json({ error: "O parâmetro 'since' é obrigatório (syncPull)" });
    }
    if (!userId) {
        return res.status(400).json({ error: "O parâmetro 'userId' é obrigatório (syncPull)" });
    }

    try {
        const budgets = await pool.query(
            `
        SELECT * FROM budgets
        WHERE user_id = $1 AND updated_at > $2
        `,
            [userId, since]
        );

        const items = await pool.query(
            `
        SELECT * FROM items
        WHERE user_id = $1 AND updated_at > $2
        `,
            [userId, since]
        );

        res.json({
            budgets: budgets.rows,
            items: items.rows
        });
    } catch (error) {
        console.error('Erro no syncPull:', error);
        throw error;
    }
}
