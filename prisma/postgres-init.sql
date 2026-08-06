-- Script SQL para Neon Postgres
-- Execute no console SQL do Neon: https://console.neon.tech

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "name" TEXT,
  "role" TEXT NOT NULL DEFAULT 'owner',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Agendamento" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "nomeCliente" TEXT NOT NULL,
  "telefone" TEXT NOT NULL,
  "servico" TEXT,
  "preco" TEXT,
  "dataPreferida" TEXT,
  "horario" TEXT,
  "observacoes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pendente',
  "pago" BOOLEAN NOT NULL DEFAULT false,
  "valorPago" DOUBLE PRECISION,
  "metodoPagamento" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Saque" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "valor" DOUBLE PRECISION NOT NULL,
  "chavePix" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pendente',
  "observacao" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Pagamento" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "agendamentoId" TEXT,
  "paymentId" TEXT UNIQUE,
  "valor" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pendente',
  "qrCode" TEXT,
  "qrCodeText" TEXT,
  "externalRef" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "PixConfig" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "chavePix" TEXT NOT NULL,
  "tipoChave" TEXT NOT NULL,
  "nomeRecebedor" TEXT NOT NULL,
  "cidade" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PixConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Agendamento_dataPreferida_idx" ON "Agendamento"("dataPreferida");
CREATE INDEX IF NOT EXISTS "Agendamento_status_idx" ON "Agendamento"("status");
CREATE INDEX IF NOT EXISTS "Pagamento_status_idx" ON "Pagamento"("status");