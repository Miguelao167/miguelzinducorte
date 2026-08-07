-- Atualiza/Cria os 4 planos com os numeros corretos de cortes
-- Execute no console SQL do Neon

-- Primeiro remove os planos errados antigos (cuidado: isso apaga assinaturas vinculadas!)
-- DELETE FROM "Assinatura";
-- DELETE FROM "Plano";

-- Atualiza os planos existentes pelo nome
UPDATE "Plano" SET "numeroCortes" = 4, "preco" = 84.9 WHERE "nome" = 'Bronze';
UPDATE "Plano" SET "numeroCortes" = 4, "preco" = 109.9 WHERE "nome" = 'Prata';
UPDATE "Plano" SET "numeroCortes" = 999, "preco" = 134.9 WHERE "nome" = 'Ouro';
UPDATE "Plano" SET "numeroCortes" = 999, "preco" = 159.9 WHERE "nome" = 'Prime';

-- Se nao existir nenhum plano cadastrado, cria os 4 (descomente se precisar)
-- INSERT INTO "Plano" (id, nome, preco, "numeroCortes", "validadeDias", ativo, "createdAt", "updatedAt")
-- VALUES
--   ('plano_bronze', 'Bronze', 84.9, 4, 30, true, NOW(), NOW()),
--   ('plano_prata', 'Prata', 109.9, 4, 30, true, NOW(), NOW()),
--   ('plano_ouro', 'Ouro', 134.9, 999, 30, true, NOW(), NOW()),
--   ('plano_prime', 'Prime', 159.9, 999, 30, true, NOW(), NOW())
-- ON CONFLICT (nome) DO NOTHING;