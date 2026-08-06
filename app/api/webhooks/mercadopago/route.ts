import { NextRequest, NextResponse } from 'next/server'
import { Payment } from 'mercadopago'
import { mpClient } from '@/lib/mercadopago'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Mercado Pago envia notificação quando o status muda
    if (body.type === 'payment' && body.data?.id) {
      const payment = new Payment(mpClient)

      const paymentData = await payment.get({ id: body.data.id })

      if (paymentData.id && paymentData.status === 'approved') {
        // Atualizar status do pagamento no banco
        const pagamento = await prisma.pagamento.update({
          where: { paymentId: paymentData.id.toString() },
          data: {
            status: 'aprovado',
            updatedAt: new Date(),
          },
        })

        // Se tiver agendamento vinculado, marcar como pago
        if (pagamento.agendamentoId) {
          await prisma.agendamento.update({
            where: { id: pagamento.agendamentoId },
            data: {
              pago: true,
              valorPago: pagamento.valor,
              metodoPagamento: 'pix_mercadopago',
              mpStatus: 'approved',
              status: 'confirmado',
            },
          })
        }

        console.log(`Pagamento ${paymentData.id} aprovado! Valor: R$ ${pagamento.valor}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ received: true })
  }
}