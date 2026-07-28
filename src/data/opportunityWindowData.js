/**
 * @typedef {'Imediata' | 'Esta semana' | 'Programada'} OpportunityPriority
 *
 * @typedef {Object} OpportunityRecordInput
 * @property {string} id
 * @property {string} patientInitials
 * @property {string} cpf
 * @property {string} cns
 * @property {string} team
 * @property {string} ine
 * @property {string[]} c4Pending
 * @property {string[]} c5Pending
 * @property {number} deadlineDays
 * @property {boolean} noRecentFollowUp
 * @property {string} lastCareInfo
 * @property {string} nextAppointment
 * @property {string} appointmentStatus
 * @property {string} recommendedAction
 *
 * @typedef {OpportunityRecordInput & {
 *   priority: OpportunityPriority,
 *   totalActions: number,
 *   combinedPlan: string
 * }} OpportunityRecord
 */

export const OPPORTUNITY_METADATA = {
  source: 'e-SUS Helper',
  competence: '2º quadrimestre de 2026',
  updatedAt: '25/07/2026 às 11:20',
}

/** @type {OpportunityRecordInput[]} */
const IMPORTED_OPPORTUNITY_RECORDS = [
  {
    id: 'opp-centro-001',
    patientInitials: 'A. M. S.',
    cpf: '***.123.456-**',
    cns: '*** 4567 8901 2345',
    team: 'ESF Centro I',
    ine: '0001234567',
    c4Pending: ['Hemoglobina glicada', 'Avaliação do pé diabético'],
    c5Pending: ['Aferição de pressão arterial', 'Peso e altura'],
    deadlineDays: 5,
    noRecentFollowUp: true,
    lastCareInfo: 'Último cuidado registrado há 42 dias',
    nextAppointment: 'Consulta prevista em 3 dias',
    appointmentStatus: 'Consulta próxima informada no relatório',
    recommendedAction: 'Unificar avaliação do pé diabético, solicitação de exame, pressão e medidas antropométricas.',
  },
  {
    id: 'opp-centro-002',
    patientInitials: 'C. A. R.',
    cpf: '***.987.654-**',
    cns: '*** 2219 6740 1187',
    team: 'ESF Centro I',
    ine: '0001234567',
    c4Pending: ['Hemoglobina glicada'],
    c5Pending: ['Consulta', 'Aferição de pressão arterial'],
    deadlineDays: 8,
    noRecentFollowUp: false,
    lastCareInfo: 'Atendimento parcial registrado no ciclo',
    nextAppointment: 'Sem consulta prevista',
    appointmentStatus: 'Sem agenda informada',
    recommendedAction: 'Orientar consulta única para avaliação C5 e solicitação do exame C4.',
  },
  {
    id: 'opp-benedito-001',
    patientInitials: 'M. C. L.',
    cpf: '***.456.789-**',
    cns: '*** 6620 8901 1198',
    team: 'ESF São Benedito',
    ine: '0002234567',
    c4Pending: ['Avaliação do pé diabético'],
    c5Pending: ['Peso e altura'],
    deadlineDays: 18,
    noRecentFollowUp: false,
    lastCareInfo: 'Consulta recente com pendência residual',
    nextAppointment: 'Consulta prevista em 12 dias',
    appointmentStatus: 'Consulta programada',
    recommendedAction: 'Aproveitar consulta programada para completar avaliação física e medidas.',
  },
  {
    id: 'opp-benedito-002',
    patientInitials: 'P. H. C.',
    cpf: '***.111.222-**',
    cns: '*** 9081 2234 7710',
    team: 'ESF São Benedito',
    ine: '0002234567',
    c4Pending: ['Hemoglobina glicada', 'Visita domiciliar'],
    c5Pending: ['Consulta', 'Aferição de pressão arterial', 'Peso e altura'],
    deadlineDays: 4,
    noRecentFollowUp: true,
    lastCareInfo: 'Sem acompanhamento recente no relatório importado',
    nextAppointment: 'Sem consulta prevista',
    appointmentStatus: 'Agenda não informada',
    recommendedAction: 'Priorizar contato e planejar consulta completa para C4 e C5.',
  },
  {
    id: 'opp-saopaulo-001',
    patientInitials: 'J. V. P.',
    cpf: '***.321.987-**',
    cns: '*** 5432 1109 8730',
    team: 'ESF São Paulo',
    ine: '0003234567',
    c4Pending: ['Hemoglobina glicada'],
    c5Pending: ['Aferição de pressão arterial', 'Peso e altura'],
    deadlineDays: 10,
    noRecentFollowUp: false,
    lastCareInfo: 'Contato orientado há 9 dias',
    nextAppointment: 'Consulta prevista em 7 dias',
    appointmentStatus: 'Consulta próxima informada no relatório',
    recommendedAction: 'Adicionar exames e aferições na consulta prevista.',
  },
  {
    id: 'opp-santa-001',
    patientInitials: 'L. F. G.',
    cpf: '***.654.321-**',
    cns: '*** 7210 9834 5621',
    team: 'ESF Santa Terezinha',
    ine: '0004234567',
    c4Pending: ['Hemoglobina glicada', 'Avaliação do pé diabético'],
    c5Pending: ['Consulta', 'Aferição de pressão arterial'],
    deadlineDays: 3,
    noRecentFollowUp: true,
    lastCareInfo: 'Ausência de acompanhamento recente',
    nextAppointment: 'Sem consulta prevista',
    appointmentStatus: 'Contato necessário antes da agenda',
    recommendedAction: 'Organizar atendimento prioritário para pendências essenciais dos dois indicadores.',
  },
  {
    id: 'opp-andaia-001',
    patientInitials: 'B. R. N.',
    cpf: '***.222.333-**',
    cns: '*** 3301 2290 7721',
    team: 'ESF Andaiá',
    ine: '0006234567',
    c4Pending: ['Hemoglobina glicada'],
    c5Pending: ['Peso e altura'],
    deadlineDays: 16,
    noRecentFollowUp: false,
    lastCareInfo: 'Registro parcial no quadrimestre',
    nextAppointment: 'Consulta prevista em 15 dias',
    appointmentStatus: 'Consulta programada',
    recommendedAction: 'Planejar coleta e medidas antropométricas na mesma ida à unidade.',
  },
  {
    id: 'opp-irma-001',
    patientInitials: 'R. D. O.',
    cpf: '***.333.444-**',
    cns: '*** 7410 5561 9920',
    team: 'ESF Irmã Dulce',
    ine: '0005234567',
    c4Pending: ['Hemoglobina glicada', 'Avaliação do pé diabético'],
    c5Pending: ['Aferição de pressão arterial'],
    deadlineDays: 6,
    noRecentFollowUp: true,
    lastCareInfo: 'Sem cuidado válido recente nos dados importados',
    nextAppointment: 'Consulta prevista em 5 dias',
    appointmentStatus: 'Consulta próxima informada no relatório',
    recommendedAction: 'Aproveitar a consulta próxima para fechar pendências críticas.',
  },
  {
    id: 'opp-urbis-001',
    patientInitials: 'P. E. A.',
    cpf: '***.444.555-**',
    cns: '*** 4309 8722 1140',
    team: 'ESF Urbis II',
    ine: '0007234567',
    c4Pending: ['Avaliação do pé diabético'],
    c5Pending: ['Aferição de pressão arterial', 'Peso e altura'],
    deadlineDays: 14,
    noRecentFollowUp: false,
    lastCareInfo: 'Registro recente com pendências de fechamento',
    nextAppointment: 'Sem consulta prevista',
    appointmentStatus: 'Pode ser agendada conforme disponibilidade',
    recommendedAction: 'Agendar atendimento único para avaliação e aferição.',
  },
  {
    id: 'opp-alto-001',
    patientInitials: 'M. T. B.',
    cpf: '***.555.666-**',
    cns: '*** 1903 8872 6601',
    team: 'ESF Alto Maron',
    ine: '0008234567',
    c4Pending: ['Avaliação do pé diabético'],
    c5Pending: ['Visita domiciliar', 'Peso e altura'],
    deadlineDays: 20,
    noRecentFollowUp: false,
    lastCareInfo: 'Acompanhamento iniciado no ciclo',
    nextAppointment: 'Consulta prevista em 18 dias',
    appointmentStatus: 'Consulta programada',
    recommendedAction: 'Preparar consulta com avaliação C4 e atualização territorial C5.',
  },
  {
    id: 'opp-lagoa-001',
    patientInitials: 'S. P. F.',
    cpf: '***.666.777-**',
    cns: '*** 6540 1120 8791',
    team: 'ESF Lagoa das Flores',
    ine: '0009234567',
    c4Pending: ['Hemoglobina glicada', 'Avaliação do pé diabético'],
    c5Pending: ['Consulta'],
    deadlineDays: 21,
    noRecentFollowUp: false,
    lastCareInfo: 'Consulta de rotina registrada parcialmente',
    nextAppointment: 'Consulta prevista em 20 dias',
    appointmentStatus: 'Consulta programada',
    recommendedAction: 'Inserir pendências C4 na consulta de acompanhamento C5.',
  },
  {
    id: 'opp-patagonia-001',
    patientInitials: 'D. L. M.',
    cpf: '***.777.888-**',
    cns: '*** 7760 4512 3012',
    team: 'ESF Patagônia',
    ine: '0010234567',
    c4Pending: ['Hemoglobina glicada'],
    c5Pending: ['Aferição de pressão arterial', 'Consulta', 'Peso e altura'],
    deadlineDays: 5,
    noRecentFollowUp: true,
    lastCareInfo: 'Sem retorno recente ao cuidado',
    nextAppointment: 'Sem consulta prevista',
    appointmentStatus: 'Precisa de organização da agenda',
    recommendedAction: 'Priorizar agendamento para resolver consulta, aferição, medidas e exame.',
  },
]

const getOpportunityPriority = (record) => {
  const totalPendencies = record.c4Pending.length + record.c5Pending.length
  const hasNearbyAppointment = record.nextAppointment !== 'Sem consulta prevista' && record.deadlineDays <= 7

  if (record.deadlineDays <= 5 || record.noRecentFollowUp || totalPendencies >= 4) return 'Imediata'
  if (record.deadlineDays <= 7 || hasNearbyAppointment) return 'Esta semana'
  return 'Programada'
}

const getCombinedPlan = (record) => {
  const c4Text = record.c4Pending.join(', ')
  const c5Text = record.c5Pending.join(', ')

  return `Planejar uma consulta para resolver C4: ${c4Text}; e C5: ${c5Text}.`
}

export const getOpportunityRecords = () => IMPORTED_OPPORTUNITY_RECORDS
  .filter((record) => record.c4Pending.length > 0 && record.c5Pending.length > 0)
  .map((record) => ({
    ...record,
    priority: getOpportunityPriority(record),
    totalActions: record.c4Pending.length + record.c5Pending.length,
    combinedPlan: getCombinedPlan(record),
  }))

export const OPPORTUNITY_RECORDS = getOpportunityRecords()
