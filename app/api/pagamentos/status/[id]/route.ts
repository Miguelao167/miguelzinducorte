import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Verificar status do pagamento
// No sistema direto, o owner marca manualmente como pago
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pagamento = await prisma.pagamento.findUnique({
      where: { paymentId: params.id },
    })

    if (!pagamento) {
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
    }

    // Se status for aprovado, retornar como approved para a UI
    const status = pagamento.status === 'aprovado' ? 'approved' : pagamento.status

    return NextResponse.json({ status })
  } catch (error) {
    console.error('Erro ao verificar status:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST - Marcar pagamento como aprovado (chamado pelo owner no painel)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pagamento = await prisma.pagamento.update({
      where: { paymentId: params.id },
      data: { status: 'aprovado' },
    })

    // Se tiver agendamento vinculado, atualizar
    if (pagamento.agendamentoId) {
      await prisma.agendamento.update({
        where: { id: pagamento.agendamentoId },
        data: {
          pago: true,
          valorPago: pagamento.valor,
          metodoPagamento: 'pix_direto',
          status: 'confirmado',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao aprovar pagamento:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}