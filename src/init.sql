CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  address TEXT,
  discount NUMERIC DEFAULT 0,
  extra_fee NUMERIC DEFAULT 0,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP,
  status TEXT DEFAULT 'EM_ANALISE'
);

CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY,
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('MATERIAL','MAO_DE_OBRA','SERVICO')),
  name TEXT NOT NULL,
  qty NUMERIC NOT NULL CHECK (qty >= 0),
  unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP
);
