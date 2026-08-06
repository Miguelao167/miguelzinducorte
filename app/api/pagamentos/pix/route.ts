import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helper'
import { gerarPixCopiaECola, gerarQrCodeBase64 } from '@/lib/pix-generator'

// POST - Gerar cobrança PIX direto com a chave do owner
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { agendamentoId, valor, descricao, nomeCliente } = body

    if (!valor || valor <= 0) {
      return NextResponse.json(
        { error: 'Valor é obrigatório e deve ser maior que zero' },
        { status: 400 }
      )
    }

    // Buscar configurações PIX do owner
    const pixConfig = await prisma.pixConfig.findUnique({
      where: { userId: user.id }
    })

    if (!pixConfig) {
      return NextResponse.json(
        { error: 'Configure sua chave PIX primeiro em /owner/configuracoes' },
        { status: 400 }
      )
    }

    // Gerar PIX Copia e Cola
    const pixCode = gerarPixCopiaECola({
      chavePix: pixConfig.chavePix,
      tipoChave: pixConfig.tipoChave as any,
      nomeRecebedor: pixConfig.nomeRecebedor,
      cidade: pixConfig.cidade,
      valor: parseFloat(valor),
      txid: agendamentoId ? `AGEND${agendamentoId.substring(0, 9)}` : undefined,
    })

    // Gerar QR Code visual
    const qrCodeBase64 = await gerarQrCodeBase64(pixCode)

    // Salvar no banco
    const pagamento = await prisma.pagamento.create({
      data: {
        agendamentoId: agendamentoId || null,
        paymentId: `pix_${Date.now()}`,
        valor: parseFloat(valor),
        status: 'pendente',
        qrCode: qrCodeBase64,
        qrCodeText: pixCode,
        externalRef: agendamentoId || null,
      },
    })

    return NextResponse.json({
      id: pagamento.id,
      paymentId: pagamento.paymentId,
      qrCode: qrCodeBase64,
      qrCodeText: pixCode,
      valor: parseFloat(valor),
      status: 'pendente',
    })
  } catch (error: any) {
    console.error('Erro ao gerar PIX:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar PIX' },
      { status: 500 }
    )
  }
}