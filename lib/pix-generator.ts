import QRCode from 'qrcode'

// Gerador de QR Code PIX (Copia e Cola) - Formato EMV BR Code
// Funciona direto com qualquer chave PIX, sem precisar de gateway

interface PixData {
  chavePix: string
  tipoChave: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria'
  nomeRecebedor: string
  cidade: string
  valor: number
  txid?: string
}

function removerAcentos(str: string): string {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function formatarCampo(id: string, valor: string): string {
  const tamanho = valor.length.toString().padStart(2, '0')
  return `${id}${tamanho}${valor}`
}

function calcularCRC(payload: string): string {
  let polinomio = 0x1021
  let resultado = 0xFFFF

  const bytes = payload.split('').map(char => char.charCodeAt(0))

  for (const byte of bytes) {
    resultado ^= byte << 8
    for (let i = 0; i < 8; i++) {
      if (resultado & 0x8000) {
        resultado = ((resultado << 1) ^ polinomio) & 0xFFFF
      } else {
        resultado = (resultado << 1) & 0xFFFF
      }
    }
  }

  return resultado.toString(16).toUpperCase().padStart(4, '0')
}

export function gerarPixCopiaECola(data: PixData): string {
  const nomeLimpo = removerAcentos(data.nomeRecebedor).substring(0, 25).toUpperCase()
  const cidadeLimpa = removerAcentos(data.cidade).substring(0, 15).toUpperCase()
  const txid = (data.txid || `AGEND${Date.now().toString().slice(-9)}`).substring(0, 25)

  // Merchant Account Information (chave PIX)
  const gui = formatarCampo('00', 'br.gov.bcb.pix')
  const chave = formatarCampo('01', removerAcentos(data.chavePix))
  const merchantAccount = formatarCampo('26', gui + chave)

  // Transaction Amount (valor)
  const valorFormatado = data.valor.toFixed(2)
  const transactionAmount = formatarCampo('54', valorFormatado)

  // Montar payload sem o CRC
  const payload =
    formatarCampo('00', '01') +                    // Payload Format Indicator
    merchantAccount +                               // Merchant Account
    formatarCampo('52', '0000') +                   // Merchant Category Code
    formatarCampo('53', '986') +                    // Transaction Currency (BRL)
    transactionAmount +                             // Transaction Amount
    formatarCampo('58', 'BR') +                     // Country Code
    formatarCampo('59', nomeLimpo) +                // Merchant Name
    formatarCampo('60', cidadeLimpa) +              // Merchant City
    formatarCampo('62', formatarCampo('05', txid)) + // Additional Data Field (TXID)
    '6304'                                          // CRC placeholder

  // Calcular CRC16
  const crc = calcularCRC(payload)

  return payload + crc
}

// Gera QR Code em base64 usando a biblioteca qrcode (funciona offline)
export async function gerarQrCodeBase64(pixCode: string): Promise<string> {
  try {
    const base64 = await QRCode.toDataURL(pixCode, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 2,
      width: 400,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return base64
  } catch (err) {
    console.error('Erro ao gerar QR Code:', err)
    return ''
  }
}