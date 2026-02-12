import pool from "../db.js";

/* ============================
   UPSERT BUDGET
============================ */

async function upsertBudget(budget) {
    const {
        id,
        title,
        client_name,
        address,
        discount,
        extra_fee,
        created_at,
        updated_at,
        deleted_at
    } = budget;

    await pool.query(
        `
    INSERT INTO budgets
    (id, title, client_name, address, discount, extra_fee, created_at, updated_at, deleted_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (id)
    DO UPDATE SET
      title = EXCLUDED.title,
      client_name = EXCLUDED.client_name,
      address = EXCLUDED.address,
      discount = EXCLUDED.discount,
      extra_fee = EXCLUDED.extra_fee,
      updated_at = EXCLUDED.updated_at,
      deleted_at = EXCLUDED.deleted_at
    `,
        [id, title, client_name, address, discount, extra_fee, created_at, updated_at, deleted_at]
    );
}

/* ============================
   UPSERT ITEM
============================ */

async function upsertItem(item) {
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
    (id, budget_id, type, name, qty, unit_price, created_at, updated_at, deleted_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (id)
    DO UPDATE SET
      type = EXCLUDED.type,
      name = EXCLUDED.name,
      qty = EXCLUDED.qty,
      unit_price = EXCLUDED.unit_price,
      updated_at = EXCLUDED.updated_at,
      deleted_at = EXCLUDED.deleted_at
    `,
        [id, budget_id, type, name, qty, unit_price, created_at, updated_at, deleted_at]
    );
}

/* ============================
   SYNC PUSH
============================ */

export async function syncPush(req, res) {
    const { budgets = [], items = [] } = req.body;

    for (const budget of budgets) {
        await upsertBudget(budget);
    }

    for (const item of items) {
        await upsertItem(item);
    }

    res.json({ success: true });
}

/* ============================
   SYNC PULL (INCREMENTAL)
============================ */

export async function syncPull(req, res) {
    const since = req.query.since;

    if (!since) {
        return res.status(400).json({ error: "Parametro 'since' é obrigatório" });
    }

    const budgets = await pool.query(
        `
    SELECT * FROM budgets
    WHERE updated_at > $1
    OR deleted_at IS NOT NULL
    `,
        [since]
    );

    const items = await pool.query(
        `
    SELECT * FROM items
    WHERE updated_at > $1
    OR deleted_at IS NOT NULL
    `,
        [since]
    );

    res.json({
        budgets: budgets.rows,
        items: items.rows
    });
}
