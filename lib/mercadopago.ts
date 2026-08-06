import { MercadoPagoConfig } from 'mercadopago'

// Configure suas credenciais do Mercado Pago aqui
// Você encontra em: https://www.mercadopago.com.br/developers/panel/credentials
export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
  },
})

export const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || ''