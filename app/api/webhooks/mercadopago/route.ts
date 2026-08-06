import { NextRequest, NextResponse } from 'next/server'

// Webhook do Mercado Pago removido na migração para PIX direto.
// Mantido como stub para evitar erro de compilação (route.ts ainda existe no path).
export async function POST(request: NextRequest) {
  return NextResponse.json({ received: true, deprecated: true })
}

export async function GET() {
  return NextResponse.json({ status: 'deprecated' })
}