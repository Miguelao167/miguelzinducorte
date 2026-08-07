-- Adiciona coluna planoId na tabela Agendamento (nullable)
ALTER TABLE "Agendamento" ADD COLUMN IF NOT EXISTS "planoId" TEXT;

-- Cria índice (sem FK pra não dar erro se o tipo da coluna Plano.id for diferente)
CREATE INDEX IF NOT EXISTS "Agendamento_planoId_idx" ON "Agendamento"("planoId");
