// Regras de horários da barbearia

// Segunda a Sexta (1, 2, 3, 4, 5): 13h às 21h
// Sábado e Domingo (0, 6): 10h às 18h

export function getHorariosForDate(dataString: string): string[] {
  if (!dataString) return []

  const data = new Date(dataString + 'T00:00:00')
  const diaSemana = data.getDay() // 0=domingo, 1=segunda, ..., 6=sábado

  // Domingo (0) ou Sábado (6): 10h às 18h
  if (diaSemana === 0 || diaSemana === 6) {
    return gerarHorarios(10, 18, 60) // a cada 1 hora
  }

  // Segunda a Sexta: 13h às 21h
  if (diaSemana >= 1 && diaSemana <= 5) {
    return gerarHorarios(13, 21, 60)
  }

  return []
}

function gerarHorarios(horaInicio: number, horaFim: number, intervaloMinutos: number): string[] {
  const horarios: string[] = []
  let hora = horaInicio
  let minuto = 0

  while (hora < horaFim) {
    const h = String(hora).padStart(2, '0')
    const m = String(minuto).padStart(2, '0')
    horarios.push(`${h}:${m}`)

    minuto += intervaloMinutos
    if (minuto >= 60) {
      hora += 1
      minuto = 0
    }
  }

  return horarios
}

export function formatarHorario(horario: string): string {
  return horario
}

export function diaEstaBloqueado(dataString: string): boolean {
  // Pode adicionar lógica pra bloquear feriados ou dias específicos
  return false
}

export function getNomeDia(dataString: string): string {
  if (!dataString) return ''
  const data = new Date(dataString + 'T00:00:00')
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  return dias[data.getDay()]
}

export function getDescricaoHorario(dataString: string): string {
  if (!dataString) return ''
  const data = new Date(dataString + 'T00:00:00')
  const diaSemana = data.getDay()

  if (diaSemana === 0 || diaSemana === 6) {
    return 'Sábado/Domingo: 10h às 18h'
  }

  return 'Segunda a Sexta: 13h às 21h'
}