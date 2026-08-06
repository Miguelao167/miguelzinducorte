# Sistema de Agendamento - Miguelzin Du Corte

## Novas Funcionalidades

### Conta de Owner
- **Login:** Acesse `/owner/login` para entrar no painel
- **Painel:** Acesse `/owner` para gerenciar agendamentos
- **Banco de Dados:** Todos os agendamentos são salvos no SQLite

### Como Configurar

#### 1. Instalar Dependências

```bash
npm install
```

#### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` e adicione uma secret:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-secret-aleatoria-aqui
```

Para gerar uma secret aleatória:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 3. Inicializar o Banco de Dados

```bash
# Gerar o cliente Prisma
npm run db:generate

# Criar as tabelas no banco
npm run db:push
```

#### 4. Criar o Usuário Owner

```bash
npm run create:owner
```

Por padrão, cria:
- **Email:** owner@miguelzinducorte.com
- **Senha:** senha123
- **Nome:** Miguelzin

Para personalizar:
```bash
npm run create:owner "seu@email.com" "sua-senha" "Seu Nome"
```

#### 5. Rodar o Projeto

```bash
npm run dev
```

---

## Acesso ao Sistema

### Página do Owner
- **URL:** http://localhost:3000/owner
- **Login:** http://localhost:3000/owner/login

### Credenciais Padrão
- **Email:** owner@miguelzinducorte.com
- **Senha:** senha123

---

## Funcionalidades do Painel

### Página `/owner`
- Ver todos os agendamentos
- Filtrar por status (Pendente, Confirmado, Cancelado, Concluído)
- Alterar status dos agendamentos
- Excluir agendamentos
- Estatísticas (total, pendentes, confirmados, concluídos)

### Fluxo de Agendamento
1. Cliente preenche o formulário em `/agendar`
2. Dados são salvos no banco
3. WhatsApp é aberto para confirmação opcional
4. Owner vê o agendamento no painel `/owner`

---

## Estrutura de Arquivos

```
├── prisma/
│   ├── schema.prisma      # Definição do banco
│   └── create-owner.ts    # Script para criar owner
├── lib/
│   ├── prisma.ts          # Cliente Prisma
│   └── auth.ts            # Configuração NextAuth
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # Rotas de autenticação
│   │   └── agendamentos/        # API de agendamentos
│   ├── owner/
│   │   ├── page.tsx      # Painel principal
│   │   ├── layout.tsx    # Layout do owner
│   │   ├── login/        # Página de login
│   │   └── OwnerDashboard.tsx
│   └── agendar/
│       └── page.tsx      # Formulário de agendamento
└── components/
    └── booking/
        └── AgendarForm.tsx  # Componente do formulário
```

---

## Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Rodar projeto em desenvolvimento |
| `npm run build` | Build de produção |
| `npm run db:push` | Sincronizar banco com schema |
| `npm run db:studio` | Abrir Prisma Studio (visualizador do banco) |
| `npm run create:owner` | Criar/atualizar usuário owner |

---

## Prisma Studio (Visualizar Banco)

Para ver o banco de dados de forma visual:

```bash
npm run db:studio
```

Isso abrirá uma interface web em http://localhost:5555 onde você pode:
- Ver todas as tabelas
- Editar registros
- Criar novos usuários
- Consultar dados
