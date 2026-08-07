-- Adiciona coluna isPlano na tabela Agendamento
ALTER TABLE "Agendamento" ADD COLUMN IF NOT EXISTS "isPlano" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "Agendamento_isPlano_idx" ON "Agendamento"("isPlano");