-- Script consolidado pra Neon
-- Força o schema correto mesmo se rodar parcialmente

CREATE TABLE IF NOT EXISTS "Cliente" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "nome" TEXT NOT NULL,
  "telefone" TEXT NOT NULL UNIQUE,
  "observacoes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Plano" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "nome" TEXT NOT NULL,
  "preco" DOUBLE PRECISION NOT NULL,
  "numeroCortes" INTEGER NOT NULL,
  "validadeDias" INTEGER NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Assinatura" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clienteId" TEXT NOT NULL,
  "planoId" TEXT NOT NULL,
  "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dataExpiracao" TIMESTAMP(3) NOT NULL,
  "cortesRestantes" INTEGER NOT NULL,
  "cortesUsados" INTEGER NOT NULL DEFAULT 0,
  "ativa" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Adiciona clienteId na Agendamento (se faltar)
ALTER TABLE "Agendamento" ADD COLUMN IF NOT EXISTS "clienteId" TEXT;

-- Índices
CREATE INDEX IF NOT EXISTS "Cliente_telefone_idx" ON "Cliente"("telefone");
CREATE INDEX IF NOT EXISTS "Assinatura_clienteId_idx" ON "Assinatura"("clienteId");
CREATE INDEX IF NOT EXISTS "Assinatura_ativa_idx" ON "Assinatura"("ativa");
CREATE INDEX IF NOT EXISTS "Agendamento_clienteId_idx" ON "Agendamento"("clienteId");

-- Foreign keys (só cria se não existir)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Assinatura_clienteId_fkey') THEN
    ALTER TABLE "Assinatura"
    ADD CONSTRAINT "Assinatura_clienteId_fkey"
    FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Assinatura_planoId_fkey') THEN
    ALTER TABLE "Assinatura"
    ADD CONSTRAINT "Assinatura_planoId_fkey"
    FOREIGN KEY ("planoId") REFERENCES "Plano"("id");
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Agendamento_clienteId_fkey') THEN
    ALTER TABLE "Agendamento"
    ADD CONSTRAINT "Agendamento_clienteId_fkey"
    FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL;
  END IF;
END $$;
