export const PATIENT_CLASSIFICATIONS = [
  {
    id: 'quase_regularizado',
    label: 'Quase regularizados',
    helper: 'Pacientes com meta atual em andamento e sem dívida clínica relevante.',
    tone: 'success',
  },
  {
    id: 'parcial',
    label: 'Acompanhamento parcial',
    helper: 'Pacientes com dívida histórica ou pendência específica.',
    tone: 'alert',
  },
  {
    id: 'absenteismo',
    label: 'Absenteísmo',
    helper: 'Pacientes com perda de vínculo, atraso histórico relevante ou visita ACS sem conversão em consulta.',
    tone: 'danger',
  },
]

const quarterDeadline = '2026-08-31'

const currentVariable = (codigo, descricao, status) => ({
  codigo,
  descricao,
  status,
  pendente: status === 'NÃO*',
})

const delayedVariable = (codigo, descricao, quadrimestre, diasAtraso, status = 'NÃO*') => ({
  codigo,
  descricao,
  status,
  pendente: status === 'NÃO*',
  quadrimestre,
  diasAtraso,
})

const noDelayedHistory = () => ({
  codigo: '—',
  descricao: 'Nenhum procedimento com histórico crítico de omissão.',
  status: 'N/A',
  pendente: false,
  quadrimestre: 'N/A',
  diasAtraso: 0,
})

const c4CurrentVariables = ({ A = 'N/A', B = 'N/A', C = 'N/A', D = 'N/A', E = 'N/A', F = 'N/A' }) => [
  currentVariable('A', 'Registrar 1 consulta até 31/08/2026', A),
  currentVariable('B', 'Registrar aferição de pressão até 31/08/2026', B),
  currentVariable('C', 'Registrar mais visitas até 31/08/2026', C),
  currentVariable('D', 'Registrar aferição de peso/altura até 31/08/2026', D),
  currentVariable('E', 'Solicitar/Avaliar hemoglobina glicada até 31/08/2026', E),
  currentVariable('F', 'Avaliar pé diabético até 31/08/2026', F),
]

const c5CurrentVariables = ({ A = 'N/A', B = 'N/A', C = 'N/A', D = 'N/A' }) => [
  currentVariable('A', 'Registrar 1 consulta até 31/08/2026', A),
  currentVariable('B', 'Registrar aferição de pressão até 31/08/2026', B),
  currentVariable('C', 'Registrar mais visitas até 31/08/2026', C),
  currentVariable('D', 'Registrar aferição de peso/altura até 31/08/2026', D),
]

const pendingFromVariables = (indicator, variables) => variables
  .filter((variable) => variable.pendente)
  .map((variable) => `${indicator} — ${variable.codigo}: ${variable.descricao}`)

const patients = [
  {
    id: 1,
    paciente: 'Abelardo P. S.',
    cpf: '***.797.169-**',
    cns: '***.797.169-**',
    equipe: 'ESF São Benedito',
    ine: '0002234567',
    indicador: 'C4 e C5',
    statusQuadrimestreAtual: 'Em andamento (Verde)',
    historicoCor: 'text-green-500',
    classification: 'quase_regularizado',
    delayHistoryStatus: 'moderado',
    delayHistoryText: 'Risco Moderado',
    detalhesHistorico: {
      classificacao: 'Risco Moderado',
      quadrimestreAtraso: 'Nenhum (Em dia no Q1-2026)',
      diasAtraso: 0,
      procedimentoPendente: 'Nenhum histórico de atraso grave',
      inteligencia: 'Paciente possui histórico regular. A meta atual do quadrimestre está em andamento. Falso positivo de absenteísmo.',
      acaoRecomendada: 'Aguardar fluxo normal de acesso programado da unidade ou agendar conforme rotina.',
    },
    variaveisIndicador: {
      C4: {
        atual: c4CurrentVariables({ A: 'SIM', B: 'N/A', C: 'SIM', D: 'SIM', E: 'SIM', F: 'SIM' }),
        atrasado: [noDelayedHistory()],
      },
      C5: {
        atual: c5CurrentVariables({ A: 'SIM', B: 'NÃO*', C: 'SIM', D: 'SIM' }),
        atrasado: [noDelayedHistory()],
      },
    },
  },
  {
    id: 2,
    paciente: 'Abeir M. S.',
    cpf: '***.933.265-**',
    cns: '***.933.265-**',
    equipe: 'ESF Centro II',
    ine: '0001334567',
    indicador: 'C5 - Hipertenso',
    statusQuadrimestreAtual: 'Em andamento (Verde)',
    historicoCor: 'text-yellow-500',
    classification: 'parcial',
    delayHistoryStatus: 'alto',
    delayHistoryText: 'Risco Alto (Pendência Básica)',
    detalhesHistorico: {
      classificacao: 'Risco Alto (Pendência Básica)',
      quadrimestreAtraso: 'Q1-2026',
      diasAtraso: 120,
      procedimentoPendente: 'Aferição de Peso/Altura (D)',
      inteligencia: 'Acompanhamento parcial: O paciente teve consulta e pressão aferida no ciclo passado, mas a antropometria foi omitida.',
      acaoRecomendada: 'Encaminhar para a recepção/triagem na próxima visita para aferir peso e altura pendentes.',
    },
    variaveisIndicador: {
      C5: {
        atual: c5CurrentVariables({ A: 'SIM', B: 'SIM', C: 'SIM', D: 'NÃO*' }),
        atrasado: [delayedVariable('D', 'Registrar aferição de peso/altura', 'Q1-2026', 120)],
      },
    },
  },
  {
    id: 3,
    paciente: 'Abigair B. P.',
    cpf: '***.534.565-**',
    cns: '***.534.565-**',
    equipe: 'ESF Urbis I',
    ine: '0007134567',
    indicador: 'C4 - Diabético',
    statusQuadrimestreAtual: 'Em andamento (Verde)',
    historicoCor: 'text-red-500',
    classification: 'parcial',
    delayHistoryStatus: 'clinico',
    delayHistoryText: 'Risco Clínico Crítico',
    detalhesHistorico: {
      classificacao: 'Risco Clínico Crítico',
      quadrimestreAtraso: 'Q1-2026',
      diasAtraso: 135,
      procedimentoPendente: 'Avaliação do Pé Diabético (F)',
      inteligencia: 'Escalonamento de Risco: Paciente compareceu à consulta no passado, mas avaliação preventiva de extremidades foi omitida. Alto risco de complicação e internação.',
      acaoRecomendada: 'Contato imediato com prioridade médica. Agendar avaliação clínica urgente do pé diabético.',
    },
    variaveisIndicador: {
      C4: {
        atual: c4CurrentVariables({ A: 'SIM', B: 'SIM', C: 'SIM', D: 'SIM', E: 'SIM', F: 'NÃO*' }),
        atrasado: [delayedVariable('F', 'Avaliação do Pé Diabético', 'Q1-2026', 135)],
      },
    },
  },
  {
    id: 4,
    paciente: 'Abelina B. M.',
    cpf: '***.155.145-**',
    cns: '***.155.145-**',
    equipe: 'ESF Alto do Morro',
    ine: '0008234567',
    indicador: 'C4 - Diabético',
    statusQuadrimestreAtual: 'Em andamento (Verde)',
    historicoCor: 'text-orange-600',
    classification: 'absenteismo',
    delayHistoryStatus: 'absenteismo_recente',
    delayHistoryText: 'Absenteísmo Recente (Paciente Zerado)',
    allVariablesNegative: true,
    detalhesHistorico: {
      classificacao: 'Absenteísmo Recente (Paciente Zerado)',
      quadrimestreAtraso: 'Q1-2026',
      diasAtraso: 150,
      procedimentoPendente: 'Todas as variáveis (A a F)',
      inteligencia: 'Paciente crônico finalizou o último ciclo totalmente sem acompanhamento (Zerado). Início de descolamento de fluxo da unidade.',
      acaoRecomendada: 'ACS deve realizar visita domiciliar urgente para resgate de vínculo antes que se torne um faltoso crônico.',
    },
    variaveisIndicador: {
      C4: {
        atual: c4CurrentVariables({ A: 'NÃO*', B: 'NÃO*', C: 'NÃO*', D: 'NÃO*', E: 'NÃO*', F: 'NÃO*' }),
        atrasado: [delayedVariable('A a F', 'Todas as variáveis clínicas e de acompanhamento.', 'Q1-2026', 150)],
      },
    },
  },
  {
    id: 5,
    paciente: 'Abilio B. S.',
    cpf: '***.604.405-**',
    cns: '***.604.405-**',
    equipe: 'ESF Maria Preta',
    ine: '0009234567',
    indicador: 'C4 e C5',
    statusQuadrimestreAtual: 'Em andamento (Verde)',
    historicoCor: 'text-slate-900',
    classification: 'absenteismo',
    delayHistoryStatus: 'absenteismo_cronico',
    delayHistoryText: 'Absenteísmo Crônico',
    inactiveMonths: 9,
    allVariablesNegative: true,
    detalhesHistorico: {
      classificacao: 'Absenteísmo Crônico',
      quadrimestreAtraso: 'Q3-2025',
      diasAtraso: 250,
      procedimentoPendente: 'Todas as variáveis (A a F)',
      inteligencia: 'Alerta Máximo: Perda total de vínculo clínico. Paciente inativo há mais de dois ciclos.',
      acaoRecomendada: 'Intervenção gerencial: ACS deve localizar paciente para resgate ou atualização de óbito/mudança de domicílio.',
    },
    variaveisIndicador: {
      C4: {
        atual: c4CurrentVariables({ A: 'NÃO*', B: 'NÃO*', C: 'NÃO*', D: 'NÃO*', E: 'NÃO*', F: 'NÃO*' }),
        atrasado: [delayedVariable('A a F', 'Inativo em múltiplas linhas de cuidado crônico.', 'Q3-2025', 250)],
      },
      C5: {
        atual: c5CurrentVariables({ A: 'NÃO*', B: 'NÃO*', C: 'NÃO*', D: 'NÃO*' }),
        atrasado: [delayedVariable('A a D', 'Inativo em múltiplas linhas de cuidado crônico.', 'Q3-2025', 250)],
      },
    },
  },
]

export const PATIENT_MODULE_DATA = patients.map((patient) => {
  const c4Pendencies = patient.variaveisIndicador.C4?.atual || []
  const c5Pendencies = patient.variaveisIndicador.C5?.atual || []
  const clinicalPendencies = [
    ...pendingFromVariables('C4', c4Pendencies),
    ...pendingFromVariables('C5', c5Pendencies),
  ]

  return {
    ...patient,
    name: patient.paciente,
    ubs: patient.equipe,
    teamId: patient.ine,
    condition: patient.indicador === 'C4 e C5'
      ? ['C4 — Diabetes', 'C5 — Hipertensão']
      : patient.indicador.startsWith('C4')
        ? ['C4 — Diabetes']
        : ['C5 — Hipertensão'],
    lastCare: patient.detalhesHistorico.inteligencia,
    nearestDeadline: patient.detalhesHistorico.diasAtraso ? `${patient.detalhesHistorico.diasAtraso} dias` : 'Sem atraso',
    metasAtuais: clinicalPendencies.length ? clinicalPendencies.map((item) => item.replace(/^C[45] — [A-F]: /, '')).slice(0, 2).join(' e ') : 'Sem pendências atuais',
    c4Pendencies,
    c5Pendencies,
    clinicalPendencies,
    previousPendingItems: [
      ...(patient.variaveisIndicador.C4?.atrasado || []),
      ...(patient.variaveisIndicador.C5?.atrasado || []),
    ],
    careDeadline: quarterDeadline,
    dataOrigin: 'Importação e-SUS Helper',
    dataPeriod: '2º quadrimestre de 2026',
  }
})
