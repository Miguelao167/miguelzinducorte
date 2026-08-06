-- Schema do Cloudflare D1
-- Gerado a partir do prisma/schema.prisma
-- Execute: npx wrangler d1 execute miguelzin-barber-db --remote --file=./prisma/cloudflare-init.sql

CREATE TABLE IF NOT EXISTS User (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'owner',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Agendamento (
  id TEXT PRIMARY KEY NOT NULL,
  nomeCliente TEXT NOT NULL,
  telefone TEXT NOT NULL,
  servico TEXT,
  preco TEXT,
  dataPreferida TEXT,
  horario TEXT,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  pago INTEGER NOT NULL DEFAULT 0,
  valorPago REAL,
  metodoPagamento TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Saque (
  id TEXT PRIMARY KEY NOT NULL,
  valor REAL NOT NULL,
  chavePix TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  observacao TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Pagamento (
  id TEXT PRIMARY KEY NOT NULL,
  agendamentoId TEXT,
  paymentId TEXT UNIQUE,
  valor REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  qrCode TEXT,
  qrCodeText TEXT,
  externalRef TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS PixConfig (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL UNIQUE,
  chavePix TEXT NOT NULL,
  tipoChave TEXT NOT NULL,
  nomeRecebedor TEXT NOT NULL,
  cidade TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_agendamento_data ON Agendamento(dataPreferida);
CREATE INDEX IF NOT EXISTS idx_agendamento_status ON Agendamento(status);
CREATE INDEX IF NOT EXISTS idx_pagamento_status ON Pagamento(status);