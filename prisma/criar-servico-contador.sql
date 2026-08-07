-- Tabela para contar cada tipo de servico separadamente
CREATE TABLE IF NOT EXISTS "ServicoContador" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "assinaturaId" TEXT NOT NULL,
  "tipo" TEXT NOT NULL,
  "limite" INTEGER NOT NULL,
  "usados" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ServicoContador_assinaturaId_fkey" FOREIGN KEY ("assinaturaId") REFERENCES "Assinatura"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "ServicoContador_assinaturaId_tipo_key" ON "ServicoContador"("assinaturaId", "tipo");
CREATE INDEX IF NOT EXISTS "ServicoContador_assinaturaId_idx" ON "ServicoContador"("assinaturaId");