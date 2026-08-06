# Integração Mercado Pago - Como Configurar

## Passo 1: Criar Conta no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/
2. Crie sua conta (ou faça login se já tiver)
3. Vá em: **Desenvolvedor → Suas integrações**

## Passo 2: Criar Aplicação

1. Clique em **"Criar aplicação"**
2. Dê um nome (ex: "Miguelzin Du Corte")
3. Escolha **Pagamentos online**
4. Confirme

## Passo 3: Obter Credenciais

1. Vá em **Credenciais**
2. Copie:
   - **Access Token** (Production ou Test, sua escolha)
   - **Public Key**

## Passo 4: Configurar no .env

Edite o arquivo `.env` do seu projeto:

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token-aqui
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-sua-public-key
```

## Passo 5: Testar

Use credenciais de **TESTE** primeiro para testar sem dinheiro real.

### Cartões de Teste (Sandbox):
- Visa: 4509 9535 6623 3704
- Master: 5031 7557 3453 0604
- CVV: 123
- Validade: qualquer data futura

### CPFs válidos para teste:
- 123.456.789-09

## Como Funciona o Sistema

### 1. Você cobra o cliente
- Acessa `/owner/cobrancas`
- Seleciona o agendamento
- Define o valor
- Clica em "Gerar PIX"
- Manda o link/código por WhatsApp

### 2. Cliente paga
- Acessa o link `/pagar/[id]`
- Vê o QR Code PIX (gerado pelo Mercado Pago)
- Paga pelo app do banco
- Página atualiza automaticamente quando o pagamento é confirmado

### 3. Você recebe
- Dinheiro fica na sua conta Mercado Pago
- Webhook notifica automaticamente o sistema
- Agendamento é marcado como "Confirmado"

### 4. Quando quiser sacar
- Acesse sua conta Mercado Pago
- Transfira para sua conta bancária
- Taxa de saque: ~R$ 3,50 por transferência (varia)

## Taxas do Mercado Pago

| Meio | Taxa |
|------|------|
| PIX | ~0,99% por transação |
| Cartão de Crédito | ~4,99% por transação |
| Saque | ~R$ 3,50 |

## Webhook (Importante!)

Para o webhook funcionar em produção, você precisa de HTTPS.
Em desenvolvimento local, pode usar ngrok:

```bash
ngrok http 3000
```

E atualizar `NEXTAUTH_URL` no `.env` com a URL do ngrok.

## Suporte

Documentação oficial: https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post