const NAO = 'NÃO*'

export const AUDIT_QUARTERS = [
  {
    id: 'Q1-2025',
    label: 'Q1-2025',
    title: '1º Quadrimestre de 2025',
    period: 'Janeiro a Abril/2025',
    deadline: '30/04/2025',
  },
  {
    id: 'Q2-2025',
    label: 'Q2-2025',
    title: '2º Quadrimestre de 2025',
    period: 'Maio a Agosto/2025',
    deadline: '31/08/2025',
  },
  {
    id: 'Q1-2026',
    label: 'Q1-2026',
    title: '1º Quadrimestre de 2026',
    period: 'Janeiro a Abril/2026',
    deadline: '30/04/2026',
  },
  {
    id: 'Q2-2026',
    label: 'Q2-2026',
    title: '2º Quadrimestre de 2026',
    period: 'Maio a Agosto/2026',
    deadline: '31/08/2026',
  },
]

const variable = (codigo, procedimento, status, deadline) => ({
  codigo,
  procedimento,
  status,
  deadline,
})

const c4Variables = ({ A, B, C, D, E, F }, deadline) => [
  variable('A', 'Registrar 1 consulta', A, deadline),
  variable('B', 'Registrar aferição de pressão', B, deadline),
  variable('C', 'Registrar mais visitas', C, deadline),
  variable('D', 'Registrar aferição de peso/altura', D, deadline),
  variable('E', 'Solicitar/Avaliar hemoglobina glicada', E, deadline),
  variable('F', 'Avaliar pé diabético', F, deadline),
]

const c5Variables = ({ A, B, C, D }, deadline) => [
  variable('A', 'Registrar 1 consulta', A, deadline),
  variable('B', 'Registrar aferição de pressão', B, deadline),
  variable('C', 'Registrar mais visitas', C, deadline),
  variable('D', 'Registrar aferição de peso/altura', D, deadline),
]

export const AUDIT_HISTORY_RECORDS = [
  {
    id: 'audit-q1-2025-abilio',
    quarterId: 'Q1-2025',
    paciente: 'Abilio B. S.',
    cpf: '***.604.405-**',
    equipe: 'ESF Maria Preta',
    indicador: 'C4 e C5',
    inactiveMonths: 12,
    atrasoQuadrimestres: 3,
    snapshots: {
      C4: c4Variables({ A: NAO, B: NAO, C: NAO, D: NAO, E: NAO, F: NAO }, '30/04/2025'),
      C5: c5Variables({ A: NAO, B: NAO, C: NAO, D: NAO }, '30/04/2025'),
    },
  },
  {
    id: 'audit-q1-2025-abigair',
    quarterId: 'Q1-2025',
    paciente: 'Abigair B. P.',
    cpf: '***.534.565-**',
    equipe: 'ESF Urbis I',
    indicador: 'C4 - Diabético',
    inactiveMonths: 4,
    atrasoQuadrimestres: 1,
    snapshots: {
      C4: c4Variables({ A: 'SIM', B: 'SIM', C: 'SIM', D: 'SIM', E: 'SIM', F: NAO }, '30/04/2025'),
    },
  },
  {
    id: 'audit-q2-2025-abilio',
    quarterId: 'Q2-2025',
    paciente: 'Abilio B. S.',
    cpf: '***.604.405-**',
    equipe: 'ESF Maria Preta',
    indicador: 'C4 e C5',
    inactiveMonths: 9,
    atrasoQuadrimestres: 3,
    snapshots: {
      C4: c4Variables({ A: NAO, B: NAO, C: NAO, D: NAO, E: NAO, F: NAO }, '31/08/2025'),
      C5: c5Variables({ A: NAO, B: NAO, C: NAO, D: NAO }, '31/08/2025'),
    },
  },
  {
    id: 'audit-q2-2025-abeir',
    quarterId: 'Q2-2025',
    paciente: 'Abeir M. S.',
    cpf: '***.933.265-**',
    equipe: 'ESF Centro II',
    indicador: 'C5 - Hipertenso',
    inactiveMonths: 4,
    atrasoQuadrimestres: 1,
    snapshots: {
      C5: c5Variables({ A: 'SIM', B: NAO, C: 'SIM', D: 'SIM' }, '31/08/2025'),
    },
  },
  {
    id: 'audit-q1-2026-abelina',
    quarterId: 'Q1-2026',
    paciente: 'Abelina B. M.',
    cpf: '***.155.145-**',
    equipe: 'ESF Alto do Morro',
    indicador: 'C4 - Diabético',
    inactiveMonths: 4,
    atrasoQuadrimestres: 1,
    snapshots: {
      C4: c4Variables({ A: NAO, B: NAO, C: NAO, D: NAO, E: NAO, F: NAO }, '30/04/2026'),
    },
  },
  {
    id: 'audit-q1-2026-abigair',
    quarterId: 'Q1-2026',
    paciente: 'Abigair B. P.',
    cpf: '***.534.565-**',
    equipe: 'ESF Urbis I',
    indicador: 'C4 - Diabético',
    inactiveMonths: 4,
    atrasoQuadrimestres: 1,
    snapshots: {
      C4: c4Variables({ A: 'SIM', B: 'SIM', C: 'SIM', D: 'SIM', E: 'SIM', F: NAO }, '30/04/2026'),
    },
  },
  {
    id: 'audit-q1-2026-abeir',
    quarterId: 'Q1-2026',
    paciente: 'Abeir M. S.',
    cpf: '***.933.265-**',
    equipe: 'ESF Centro II',
    indicador: 'C5 - Hipertenso',
    inactiveMonths: 4,
    atrasoQuadrimestres: 1,
    snapshots: {
      C5: c5Variables({ A: 'SIM', B: 'SIM', C: 'SIM', D: NAO }, '30/04/2026'),
    },
  },
  {
    id: 'audit-q2-2026-abelardo',
    quarterId: 'Q2-2026',
    paciente: 'Abelardo P. S.',
    cpf: '***.797.169-**',
    equipe: 'ESF São Benedito',
    indicador: 'C4 e C5',
    inactiveMonths: 4,
    atrasoQuadrimestres: 1,
    snapshots: {
      C4: c4Variables({ A: 'SIM', B: 'N/A', C: 'SIM', D: 'SIM', E: 'SIM', F: NAO }, '31/08/2026'),
      C5: c5Variables({ A: 'SIM', B: NAO, C: 'SIM', D: 'SIM' }, '31/08/2026'),
    },
  },
  {
    id: 'audit-q2-2026-abelina',
    quarterId: 'Q2-2026',
    paciente: 'Abelina B. M.',
    cpf: '***.155.145-**',
    equipe: 'ESF Alto do Morro',
    indicador: 'C4 - Diabético',
    inactiveMonths: 4,
    atrasoQuadrimestres: 1,
    snapshots: {
      C4: c4Variables({ A: NAO, B: NAO, C: NAO, D: NAO, E: NAO, F: NAO }, '31/08/2026'),
    },
  },
]

const isPending = (variableItem) => variableItem?.status === NAO
const getIndicators = (record) => Object.keys(record.snapshots)
const getVariable = (record, indicator, code) => record.snapshots[indicator]?.find((item) => item.codigo === code)

const allMandatoryNegative = (record, indicator) => (
  record.snapshots[indicator]?.every((item) => item.status === NAO) || false
)

const hasAnyAllMandatoryNegative = (record) => getIndicators(record).some((indicator) => allMandatoryNegative(record, indicator))

const hasCriticalPendency = (record) => (
  getIndicators(record).some((indicator) => {
    if (indicator === 'C4') return isPending(getVariable(record, indicator, 'A')) || isPending(getVariable(record, indicator, 'F'))
    if (indicator === 'C5') return isPending(getVariable(record, indicator, 'A')) || isPending(getVariable(record, indicator, 'B'))
    return false
  })
)

export const getAuditDelayStatus = (record) => {
  if (record.inactiveMonths > 8 && record.atrasoQuadrimestres > 2 && hasAnyAllMandatoryNegative(record)) {
    return {
      id: 'absenteismo_cronico',
      label: 'Absenteísmo Crônico',
      explanation: 'Elegível porque ficou inativo por mais de 8 meses e manteve variáveis obrigatórias como NÃO* em mais de dois quadrimestres.',
      className: 'bg-gray-900 text-white',
    }
  }

  if (record.atrasoQuadrimestres === 1 && hasAnyAllMandatoryNegative(record)) {
    return {
      id: 'absenteismo_recente',
      label: 'Absenteísmo Recente',
      explanation: 'Elegível porque encerrou 1 quadrimestre zerado, com todas as variáveis obrigatórias como NÃO*.',
      className: 'bg-orange-200 text-orange-900',
    }
  }

  if (record.atrasoQuadrimestres === 1 && hasCriticalPendency(record)) {
    return {
      id: 'risco_clinico',
      label: 'Risco Clínico',
      explanation: 'Elegível porque há atraso de 1 quadrimestre com pendência crítica do indicador.',
      className: 'bg-red-100 text-red-800',
    }
  }

  return {
    id: 'risco_alto',
    label: 'Risco Alto',
    explanation: 'Elegível por pendência histórica procedimental sem gatilho clínico crítico.',
    className: 'bg-yellow-100 text-yellow-800',
  }
}

export const getAuditClinicalAlert = (record, indicator) => {
  const status = getAuditDelayStatus(record)
  const consultaPendente = isPending(getVariable(record, indicator, 'A'))
  const pressaoPendente = isPending(getVariable(record, indicator, 'B'))
  const peDiabeticoPendente = isPending(getVariable(record, indicator, 'F'))

  if (status.id === 'absenteismo_cronico') {
    return 'Alerta máximo: paciente permaneceu sem vínculo clínico por mais de 8 meses. A fotografia mostra perda sustentada de acompanhamento e necessidade de localização territorial.'
  }

  if (status.id === 'absenteismo_recente') {
    return 'Atenção: paciente encerrou o quadrimestre zerado. Todas as variáveis obrigatórias ficaram como NÃO*, indicando ruptura recente do fluxo assistencial.'
  }

  if (indicator === 'C4' && peDiabeticoPendente) {
    return 'Atenção: paciente encerrou o quadrimestre sem avaliação do Pé Diabético. Alto risco de agravamento e amputação por falta de rastreio preventivo.'
  }

  if (indicator === 'C4' && consultaPendente) {
    return 'Atenção: paciente diabético encerrou o quadrimestre sem consulta médica registrada. Risco de descompensação clínica por ausência de seguimento.'
  }

  if (indicator === 'C5' && pressaoPendente) {
    return 'Atenção: paciente hipertenso encerrou o quadrimestre sem aferição de pressão. Risco de descontrole pressórico sem monitoramento mínimo.'
  }

  if (indicator === 'C5' && consultaPendente) {
    return 'Atenção: paciente hipertenso encerrou o quadrimestre sem consulta médica registrada. Risco de agravamento por falha no acompanhamento.'
  }

  return 'Fotografia histórica com pendência procedimental. A equipe deve revisar o fluxo que impediu o fechamento da meta naquele quadrimestre.'
}

export const getQuarterSummary = (quarterId) => {
  const records = AUDIT_HISTORY_RECORDS.filter((record) => record.quarterId === quarterId)

  return {
    total: records.length,
    critical: records.filter((record) => ['risco_clinico', 'absenteismo_cronico'].includes(getAuditDelayStatus(record).id)).length,
  }
}
