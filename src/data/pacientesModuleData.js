import { MOCK_PATIENTS } from './mockData'

export const PATIENT_CLASSIFICATIONS = [
  {
    id: 'quase_regularizado',
    label: 'Quase regularizados',
    helper: 'Pacientes com poucas pendências para conclusão.',
    tone: 'success',
  },
  {
    id: 'parcial',
    label: 'Acompanhamento parcial',
    helper: 'Pacientes com acompanhamento incompleto.',
    tone: 'alert',
  },
  {
    id: 'zerado',
    label: 'Zerados',
    helper: 'Pacientes sem acompanhamento válido no ciclo.',
    tone: 'danger',
  },
]

const quarterDeadline = '2026-08-31'

const pending = (indicator, type, label, status, daysRemaining, requiredAmount = null) => ({
  id: `${indicator}-${type}-${status}-${daysRemaining}`,
  indicator,
  type,
  label,
  status,
  daysRemaining,
  requiredAmount,
  deadline: quarterDeadline,
})

const patientClinicalProfiles = {
  1: {
    patientOverride: {
      name: 'Abelardo P. S.',
      cpf: '***.797.169-**',
      cns: '***.797.169-**',
      ubs: 'ESF São Benedito',
      ine: '0002234567',
      pacientesStatus: 'parcial',
    },
    condition: ['C4 — Diabetes'],
    lastCare: 'Consulta de enfermagem registrada em 18/06/2026',
    nearestDeadline: '7 dias',
    indicador: 'C4 - Diabético',
    statusQuadrimestreAtual: 'Em andamento (Verde)',
    metasAtuais: 'Consulta e HbA1c',
    historicoCor: 'text-red-500',
    delayHistoryStatus: 'clinico',
    delayHistoryText: 'Risco Clínico - Vermelho',
    detalhesHistorico: {
      classificacao: 'Risco Clínico',
      quadrimestreAtraso: 'Q1-2026',
      diasAtraso: 120,
      procedimentoPendente: 'Avaliação do Pé Diabético (F)',
      inteligencia: 'Paciente possui prazo no quadrimestre atual, porém carrega dívida clínica do ciclo anterior. Risco alto de complicação.',
    },
    variaveisIndicador: {
      atual: [
        { codigo: 'A', descricao: 'Registrar 1 consulta até 31/08/2026', status: 'NÃO*', pendente: true },
        { codigo: 'B', descricao: 'Registrar aferição de pressão até 31/08/2026', status: 'N/A', pendente: false },
        { codigo: 'C', descricao: 'Registrar mais 2 visita(s) até 31/08/2026', status: 'NÃO*', pendente: true },
        { codigo: 'D', descricao: 'Registrar aferição de peso/altura até 31/08/2026', status: 'N/A', pendente: false },
        { codigo: 'E', descricao: 'Solicitar/Avaliar hemoglobina glicada até 31/08/2026', status: 'NÃO*', pendente: true },
        { codigo: 'F', descricao: 'Avaliar pé diabético até 31/08/2026', status: 'NÃO*', pendente: true },
      ],
      atrasado: [
        { codigo: 'F', descricao: 'Avaliação do Pé Diabético', status: 'NÃO*', pendente: true, quadrimestre: 'Q1-2026', diasAtraso: 120 },
      ],
    },
    previousPendingItems: [
      { label: 'Avaliação do Pé Diabético (F)', quarter: '1º quadrimestre de 2026' },
    ],
    c4Pendencies: [
      pending('C4', 'pes', 'Realizar avaliação dos pés', 'ATTENTION', 45),
      pending('C4', 'hemoglobina', 'Solicitar ou avaliar hemoglobina glicada', 'PENDING', 42),
    ],
    c5Pendencies: [],
  },
  2: {
    patientOverride: {
      name: 'Abeir M. S.',
      cpf: '***.933.265-**',
      cns: '***.933.265-**',
      ubs: 'ESF Centro II',
      ine: '0001334567',
      pacientesStatus: 'parcial',
    },
    condition: ['C5 — Hipertensão'],
    lastCare: 'Acompanhamento parcial no ciclo anterior',
    nearestDeadline: '40 dias',
    indicador: 'C5 - Hipertenso',
    statusQuadrimestreAtual: 'Em andamento (Verde)',
    metasAtuais: 'Consulta e Pressão Arterial',
    historicoCor: 'text-yellow-500',
    delayHistoryStatus: 'alto',
    delayHistoryText: 'Risco Alto (Pendência Básica) - Amarelo',
    detalhesHistorico: {
      classificacao: 'Risco Alto (Pendência Básica)',
      quadrimestreAtraso: 'Q1-2026',
      diasAtraso: 120,
      procedimentoPendente: 'Aferição de Peso/Altura (D)',
      inteligencia: 'Acompanhamento parcial no ciclo anterior. Meta atual em andamento.',
    },
    variaveisIndicador: {
      atual: [
        { codigo: 'A', descricao: 'Registrar 1 consulta até 31/08/2026', status: 'NÃO*', pendente: true },
        { codigo: 'B', descricao: 'Registrar aferição de pressão até 31/08/2026', status: 'NÃO*', pendente: true },
        { codigo: 'C', descricao: 'Registrar mais 2 visita(s) até 31/08/2026', status: 'SIM', pendente: false },
        { codigo: 'D', descricao: 'Registrar aferição de peso/altura até 31/08/2026', status: 'NÃO*', pendente: true },
      ],
      atrasado: [
        { codigo: 'D', descricao: 'Aferição de Peso/Altura', status: 'NÃO*', pendente: true, quadrimestre: 'Q1-2026', diasAtraso: 120 },
      ],
    },
    previousPendingItems: [
      { label: 'Aferição de Peso/Altura (D)', quarter: '1º quadrimestre de 2026' },
    ],
    c4Pendencies: [],
    c5Pendencies: [
      pending('C5', 'consulta', 'Registrar consulta', 'PENDING', 40),
      pending('C5', 'pressao', 'Aferir pressão', 'PENDING', 40),
      pending('C5', 'peso_altura', 'Registrar peso e altura', 'PENDING', 40),
    ],
  },
  3: {
    condition: ['C5 — Hipertensão'],
    lastCare: 'Consulta médica registrada em 24/06/2026',
    nearestDeadline: '18 dias',
    c4Pendencies: [],
    c5Pendencies: [
      pending('C5', 'consulta', 'Registrar consulta', 'ATTENTION', 18),
    ],
  },
  4: {
    condition: ['C5 — Hipertensão'],
    lastCare: 'Visita domiciliar registrada em 12/06/2026',
    nearestDeadline: '10 dias',
    c4Pendencies: [],
    c5Pendencies: [
      pending('C5', 'pressao', 'Aferir pressão', 'CRITICAL', 10),
      pending('C5', 'visita', 'Registrar 1 visita', 'PENDING', 36, 1),
    ],
  },
  5: {
    condition: ['C4 — Diabetes', 'C5 — Hipertensão'],
    lastCare: 'Sem cuidado válido no ciclo atual',
    nearestDeadline: 'Crítico',
    inactiveMonths: 9,
    c4Pendencies: [
      pending('C4', 'hemoglobina', 'Solicitar ou avaliar hemoglobina glicada', 'OVERDUE', -2),
      pending('C4', 'pes', 'Realizar avaliação dos pés', 'CRITICAL', 6),
    ],
    c5Pendencies: [
      pending('C5', 'consulta', 'Registrar consulta', 'PENDING', 31),
      pending('C5', 'peso_altura', 'Registrar peso e altura', 'ATTENTION', 22),
    ],
  },
  6: {
    condition: ['C5 — Hipertensão'],
    lastCare: 'Aferição registrada em 27/06/2026',
    nearestDeadline: '22 dias',
    c4Pendencies: [],
    c5Pendencies: [],
  },
  7: {
    condition: ['C4 — Diabetes'],
    lastCare: 'Consulta ACS registrada em 11/06/2026',
    nearestDeadline: '12 dias',
    c4Pendencies: [
      pending('C4', 'hemoglobina', 'Solicitar ou avaliar hemoglobina glicada', 'ATTENTION', 12),
      pending('C4', 'visita', 'Registrar 1 visita', 'PENDING', 38, 1),
    ],
    c5Pendencies: [],
  },
  8: {
    condition: ['C4 — Diabetes'],
    lastCare: 'Sem cuidado válido no ciclo atual',
    nearestDeadline: 'Crítico',
    inactiveMonths: 10,
    c4Pendencies: [
      pending('C4', 'consulta', 'Registrar consulta', 'OVERDUE', -5),
      pending('C4', 'hemoglobina', 'Solicitar ou avaliar hemoglobina glicada', 'CRITICAL', 5),
      pending('C4', 'pes', 'Realizar avaliação dos pés', 'CRITICAL', 8),
      pending('C4', 'visita', 'Registrar 2 visitas', 'PENDING', 33, 2),
    ],
    c5Pendencies: [],
  },
  9: {
    condition: ['C5 — Hipertensão'],
    lastCare: 'Consulta programada registrada em 20/06/2026',
    nearestDeadline: '15 dias',
    c4Pendencies: [],
    c5Pendencies: [
      pending('C5', 'consulta', 'Registrar consulta', 'ATTENTION', 15),
      pending('C5', 'pressao', 'Aferir pressão', 'PENDING', 41),
    ],
  },
  10: {
    condition: ['C4 — Diabetes', 'C5 — Hipertensão'],
    lastCare: 'Visita ACS registrada em 08/06/2026',
    nearestDeadline: '9 dias',
    c4Pendencies: [
      pending('C4', 'indisponivel', 'Dados não encontrados no relatório', 'UNAVAILABLE', 0),
    ],
    c5Pendencies: [
      pending('C5', 'visita', 'Registrar 1 visita', 'CRITICAL', 9, 1),
    ],
  },
  11: {
    condition: ['C4 — Diabetes', 'C5 — Hipertensão'],
    lastCare: 'Consulta de rotina registrada em 26/06/2026',
    nearestDeadline: '20 dias',
    previousPendingItems: [
      { label: 'Peso e altura', quarter: '1º quadrimestre de 2026' },
    ],
    delayHistoryStatus: 'alto',
    delayHistoryText: 'Risco Alto: atraso procedimental há 1 quadrimestre',
    c4Pendencies: [
      pending('C4', 'pes', 'Realizar avaliação dos pés', 'ATTENTION', 20),
    ],
    c5Pendencies: [
      pending('C5', 'peso_altura', 'Registrar peso e altura', 'PENDING', 40),
    ],
  },
  12: {
    condition: ['C4 — Diabetes', 'C5 — Hipertensão'],
    lastCare: 'Sem cuidado válido no ciclo atual',
    nearestDeadline: 'Crítico',
    allVariablesNegative: true,
    inactiveMonths: 4,
    c4Pendencies: [
      pending('C4', 'hemoglobina', 'Solicitar ou avaliar hemoglobina glicada', 'CRITICAL', 5),
      pending('C4', 'visita', 'Registrar 2 visitas', 'PENDING', 32, 2),
    ],
    c5Pendencies: [
      pending('C5', 'pressao', 'Aferir pressão', 'CRITICAL', 5),
      pending('C5', 'peso_altura', 'Registrar peso e altura', 'ATTENTION', 14),
    ],
  },
}

export const PATIENT_MODULE_DATA = MOCK_PATIENTS.map((patient) => {
  const clinicalProfile = patientClinicalProfiles[patient.id]
  const basePatient = {
    ...patient,
    ...(clinicalProfile.patientOverride || {}),
  }
  const pendencies = [...clinicalProfile.c4Pendencies, ...clinicalProfile.c5Pendencies]
  const clinicalPendencyLabels = pendencies.map((pendency) => `${pendency.indicator} — ${pendency.label}`)

  return {
    ...basePatient,
    paciente: basePatient.name,
    equipe: basePatient.ubs,
    teamId: basePatient.ine,
    classification: basePatient.pacientesStatus,
    condition: clinicalProfile.condition,
    lastCare: clinicalProfile.lastCare,
    nearestDeadline: clinicalProfile.nearestDeadline,
    indicador: clinicalProfile.indicador || clinicalProfile.condition.join(' + '),
    statusQuadrimestreAtual: clinicalProfile.statusQuadrimestreAtual || 'Em andamento',
    metasAtuais: clinicalProfile.metasAtuais || clinicalPendencyLabels.slice(0, 2).map((label) => label.replace(/^C[45] — /, '')).join(' e ') || 'Sem pendências atuais',
    historicoCor: clinicalProfile.historicoCor,
    detalhesHistorico: clinicalProfile.detalhesHistorico,
    variaveisIndicador: clinicalProfile.variaveisIndicador || { atual: [], atrasado: [] },
    c4Pendencies: clinicalProfile.c4Pendencies,
    c5Pendencies: clinicalProfile.c5Pendencies,
    clinicalPendencies: clinicalPendencyLabels,
    previousPendingItems: clinicalProfile.previousPendingItems || [],
    allVariablesNegative: clinicalProfile.allVariablesNegative || false,
    inactiveMonths: clinicalProfile.inactiveMonths,
    delayHistoryStatus: clinicalProfile.delayHistoryStatus,
    delayHistoryText: clinicalProfile.delayHistoryText,
    careDeadline: quarterDeadline,
    dataOrigin: 'Importação e-SUS Helper',
    dataPeriod: '2º quadrimestre de 2026',
  }
})
