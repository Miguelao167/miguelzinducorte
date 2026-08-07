-- Insere os 4 planos padrao se nao existirem
INSERT INTO "Plano" (id, nome, preco, "numeroCortes", "validadeDias", ativo, "createdAt", "updatedAt")
SELECT 'plano_bronze_001', 'Bronze', 84.9, 4, 30, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Plano" WHERE LOWER(nome) = 'bronze');

INSERT INTO "Plano" (id, nome, preco, "numeroCortes", "validadeDias", ativo, "createdAt", "updatedAt")
SELECT 'plano_prata_001', 'Prata', 109.9, 4, 30, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Plano" WHERE LOWER(nome) = 'prata');

INSERT INTO "Plano" (id, nome, preco, "numeroCortes", "validadeDias", ativo, "createdAt", "updatedAt")
SELECT 'plano_ouro_001', 'Ouro', 134.9, 999, 30, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Plano" WHERE LOWER(nome) = 'ouro');

INSERT INTO "Plano" (id, nome, preco, "numeroCortes", "validadeDias", ativo, "createdAt", "updatedAt")
SELECT 'plano_prime_001', 'Prime', 159.9, 999, 30, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Plano" WHERE LOWER(nome) = 'prime');

-- Mostra os planos cadastrados
SELECT id, nome, preco, "numeroCortes", "validadeDias" FROM "Plano" ORDER BY preco;
