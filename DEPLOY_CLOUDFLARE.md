# Deploy no Cloudflare Pages com D1

Este projeto usa **Next.js 15 + Cloudflare D1** (SQLite gratuito do Cloudflare, até 5GB).

## ✅ Já foi configurado

- `lib/prisma.ts` detecta automaticamente o D1 em produção
- `prisma/cloudflare-init.sql` cria todas as tabelas
- `wrangler.toml` configura o binding do D1
- Mercado Pago foi removido (usa PIX direto)

## 📋 Passo a passo no Cloudflare

### 1. Criar o banco D1

1. Acesse https://dash.cloudflare.com/
2. Vá em **Workers & Pages** → aba **D1 SQL Database**
3. Clique **Create database**
4. Nome: `miguelzin-barber-db`
5. Clique **Create**
6. **Copie o Database ID** que aparece

### 2. Configurar o projeto no wrangler.toml

Abra `wrangler.toml` no projeto e troque `SEU_DATABASE_ID_AQUI` pelo ID copiado.

### 3. Criar as tabelas no D1

No terminal (com wrangler instalado):

```bash
npx wrangler d1 execute miguelzin-barber-db --remote --file=./prisma/cloudflare-init.sql
```

### 4. Conectar o D1 ao Cloudflare Pages

1. No painel do Cloudflare → **Workers & Pages**
2. Abra seu projeto Pages (ou crie um novo conectando este repo GitHub)
3. Vá em **Settings → Functions**
4. Em **D1 database bindings**, clique **Add binding**:
   - Variable name: `DB`
   - D1 database: selecione `miguelzin-barber-db`
5. Salve

### 5. Variáveis de ambiente

Em **Settings → Environment variables**:

| Variável | Valor |
|----------|-------|
| `JWT_SECRET` | uma string aleatória longa (ex: `miguelzin-2024-trocar-depois-xyz123`) |
| `NODE_VERSION` | `20` |

### 6. Build settings

Em **Settings → Builds**:

- **Build command:** `npm run build`
- **Build output directory:** `.next`
- **Root directory:** `/` (deixe vazio)
- **Node version:** `20`

### 7. Criar o owner no D1

Após o deploy funcionar, você precisa criar o usuário owner. Há 2 jeitos:

**Jeito 1 — pelo site (mais fácil):**
Eu posso adicionar uma rota `/api/setup-admin` que cria o owner na primeira vez que rodar. Me avisa se quiser.

**Jeito 2 — via wrangler SQL:**
Rode localmente:
```bash
node -e "const b=require('bcryptjs');console.log(b.hashSync('SUA_SENHA',10))"
```
Copie o hash gerado, edite `prisma/create-owner.sql` substituindo o placeholder, depois:
```bash
npx wrangler d1 execute miguelzin-barber-db --remote --file=./prisma/create-owner.sql
```

## 🧪 Testar localmente com SQLite normal

```bash
# Criar .env
DATABASE_URL="file:./dev.db"
JWT_SECRET="qualquer-coisa-local"

# Criar tabelas
npx prisma db push

# Criar owner
npm run create:owner

# Rodar
npm run dev
```

## 📁 Arquivos importantes

- `lib/prisma.ts` — Detecta D1 e usa adapter
- `prisma/schema.prisma` — Schema Prisma (pra dev local)
- `prisma/cloudflare-init.sql` — SQL pro D1 em produção
- `wrangler.toml` — Config do Cloudflare
- `next.config.js` — Fallback para módulos nativos

## 🆘 Problemas comuns

**"D1 binding DB not found":**
Você não configurou o binding em Settings → Functions → D1 database bindings.

**Build falha com "Cannot find module @prisma/adapter-d1":**
Rode `npm install` antes do build.

**Banco vazio após deploy:**
Você não rodou o `cloudflare-init.sql`. Rode o comando do passo 3.

**Login não funciona em produção:**
Verifique se `JWT_SECRET` está configurado nas env vars.