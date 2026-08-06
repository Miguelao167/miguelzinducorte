-- Script para criar o owner no Cloudflare D1
-- Uso: npx wrangler d1 execute miguelzin-barber-db --remote --file=./prisma/create-owner.sql

-- A senha "senha123" já é hash bcrypt. Troque depois pelo painel.
-- Para gerar novo hash: node -e "const b=require('bcryptjs');console.log(b.hashSync('SUA_SENHA',10))"

INSERT OR REPLACE INTO User (id, email, password, name, role, createdAt, updatedAt)
VALUES (
  'owner-default-id',
  'owner@miguelzinducorte.com',
  '$2a$10$YourBcryptHashHere.ReplaceAfterFirstLogin',
  'Miguelzin',
  'owner',
  datetime('now'),
  datetime('now')
);