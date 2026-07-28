/**
 * @typedef {Object} ActiveSearchTeam
 * @property {string} id
 * @property {string} name
 * @property {string} ine
 *
 * @typedef {Object} ActiveSearchPriority
 * @property {'absenteismo' | 'parcial'} id
 * @property {string} label
 * @property {string} shortLabel
 * @property {string} description
 * @property {'danger' | 'alert'} tone
 *
 * @typedef {Object} ClinicalPendingItem
 * @property {string} id
 * @property {'C4' | 'C5'} indicator
 * @property {string} name
 * @property {string} due
 *
 * @typedef {Object} ActiveSearchRecord
 * @property {string} id
 * @property {string} teamId
 * @property {string} patientInitials
 * @property {string} cpf
 * @property {string} cns
 * @property {'absenteismo' | 'parcial'} classification
 * @property {string[]} clinicalConditions
 * @property {string} microArea
 * @property {string} acsInitials
 * @property {string} searchReason
 * @property {string} contactStatus
 * @property {string} lastContact
 * @property {'Crítica' | 'Alta' | 'Programada'} priority
 * @property {string} suggestedAction
 * @property {ClinicalPendingItem[]} pendingItems
 * @property {boolean} [allVariablesNegative]
 * @property {number} [inactiveMonths]
 * @property {{ label: string, quarter: string }[]} [previousPendingItems]
 */

/** @type {ActiveSearchTeam[]} */
export const ACTIVE_SEARCH_TEAMS = [
  { id: '0001234567', name: 'ESF Centro I', ine: '0001234567' },
  { id: '0002234567', name: 'ESF São Benedito', ine: '0002234567' },
  { id: '0003234567', name: 'ESF São Paulo', ine: '0003234567' },
  { id: '0004234567', name: 'ESF Santa Terezinha', ine: '0004234567' },
  { id: '0006234567', name: 'ESF Andaiá', ine: '0006234567' },
  { id: '0005234567', name: 'ESF Irmã Dulce', ine: '0005234567' },
  { id: '0007234567', name: 'ESF Urbis II', ine: '0007234567' },
  { id: '0008234567', name: 'ESF Alto Maron', ine: '0008234567' },
  { id: '0009234567', name: 'ESF Lagoa das Flores', ine: '0009234567' },
  { id: '0010234567', name: 'ESF Patagônia', ine: '0010234567' },
]

/** @type {ActiveSearchPriority[]} */
export const ACTIVE_SEARCH_PRIORITIES = [
  {
    id: 'absenteismo',
    label: 'Pacientes com absenteísmo',
    shortLabel: 'Absenteísmo',
    description: 'Ausência em atendimento ou sem cuidado válido no ciclo.',
    tone: 'danger',
  },
  {
    id: 'parcial',
    label: 'Acompanhamento parcial',
    shortLabel: 'Acompanhamento parcial',
    description: 'Possuem cuidado iniciado, mas ainda apresentam pendências.',
    tone: 'alert',
  },
]

/** @type {ActiveSearchRecord[]} */
export const ACTIVE_SEARCH_RECORDS = [
  {
    id: 'acs-centro-abs-001',
    teamId: '0001234567',
    patientInitials: 'B. R. O.',
    cpf: '***.584.210-**',
    cns: '*** 2104 6721 8830',
    classification: 'absenteismo',
    clinicalConditions: ['C5 — Hipertensão'],
    microArea: '01',
    acsInitials: 'R. A. L.',
    searchReason: 'Ausência em consulta programada',
    contactStatus: '2 tentativas sem resposta',
    lastContact: 'Há 28 dias',
    priority: 'Crítica',
    suggestedAction: 'Priorizar visita domiciliar no próximo roteiro',
    allVariablesNegative: true,
    inactiveMonths: 4,
    pendingItems: [
      { id: 'c5-consulta-centro-001', indicator: 'C5', name: 'Consulta', due: '5 dias' },
      { id: 'c5-pa-centro-001', indicator: 'C5', name: 'Aferição de pressão', due: '5 dias' },
      { id: 'c5-peso-centro-001', indicator: 'C5', name: 'Peso e altura', due: '5 dias' },
      { id: 'c5-visita-centro-001', indicator: 'C5', name: 'Visita domiciliar', due: '5 dias' },
    ],
    previousPendingItems: [
      { label: 'Consulta de acompanhamento', quarter: '1º quadrimestre de 2026' },
      { label: 'Visita domiciliar', quarter: '1º quadrimestre de 2026' },
    ],
  },
  {
    id: 'acs-centro-par-001',
    teamId: '0001234567',
    patientInitials: 'A. M. S.',
    cpf: '***.123.456-**',
    cns: '*** 4567 8901 2345',
    classification: 'parcial',
    clinicalConditions: ['C4 — Diabetes', 'C5 — Hipertensão'],
    microArea: '03',
    acsInitials: 'M. J. S.',
    searchReason: 'Visita do ACS não registrada',
    contactStatus: 'Sem retorno',
    lastContact: 'Há 16 dias',
    priority: 'Alta',
    suggestedAction: 'Confirmar vínculo e aferição de pressão',
    pendingItems: [
      { id: 'c4-hba1c-centro-001', indicator: 'C4', name: 'Hemoglobina glicada', due: '12 dias' },
      { id: 'c4-pe-centro-001', indicator: 'C4', name: 'Avaliação do pé diabético', due: '12 dias' },
      { id: 'c5-pa-centro-002', indicator: 'C5', name: 'Aferição de pressão', due: '7 dias' },
    ],
  },
  {
    id: 'acs-sao-benedito-abs-001',
    teamId: '0002234567',
    patientInitials: 'P. H. C.',
    cpf: '***.111.222-**',
    cns: '*** 9081 2234 7710',
    classification: 'absenteismo',
    clinicalConditions: ['C5 — Hipertensão'],
    microArea: '02',
    acsInitials: 'T. S. A.',
    searchReason: 'Sem retorno ao cuidado',
    contactStatus: 'Telefone desatualizado',
    lastContact: 'Há 34 dias',
    priority: 'Crítica',
    suggestedAction: 'Verificar permanência no território',
    allVariablesNegative: false,
    inactiveMonths: 9,
    pendingItems: [
      { id: 'c5-consulta-benedito-001', indicator: 'C5', name: 'Consulta', due: '4 dias' },
      { id: 'c5-pa-benedito-001', indicator: 'C5', name: 'Aferição de pressão', due: '4 dias' },
      { id: 'c5-visita-benedito-001', indicator: 'C5', name: 'Visita domiciliar', due: '4 dias' },
    ],
    previousPendingItems: [
      { label: 'Consulta de acompanhamento', quarter: '1º quadrimestre de 2026' },
      { label: 'Aferição de pressão', quarter: '3º quadrimestre de 2025' },
    ],
  },
  {
    id: 'acs-sao-benedito-par-001',
    teamId: '0002234567',
    patientInitials: 'M. C. L.',
    cpf: '***.456.789-**',
    cns: '*** 6620 8901 1198',
    classification: 'parcial',
    clinicalConditions: ['C5 — Hipertensão'],
    microArea: '04',
    acsInitials: 'L. C. N.',
    searchReason: 'Consulta de acompanhamento pendente',
    contactStatus: 'Contato orientado',
    lastContact: 'Há 9 dias',
    priority: 'Programada',
    suggestedAction: 'Orientar retorno à unidade',
    pendingItems: [
      { id: 'c5-consulta-benedito-002', indicator: 'C5', name: 'Consulta', due: '18 dias' },
      { id: 'c5-peso-benedito-001', indicator: 'C5', name: 'Peso e altura', due: '18 dias' },
    ],
  },
  {
    id: 'acs-sao-paulo-par-001',
    teamId: '0003234567',
    patientInitials: 'J. V. P.',
    cpf: '***.321.987-**',
    cns: '*** 5432 1109 8730',
    classification: 'parcial',
    clinicalConditions: ['C5 — Hipertensão'],
    microArea: '05',
    acsInitials: 'N. P. R.',
    searchReason: 'Peso e altura não registrados',
    contactStatus: '1 tentativa sem resposta',
    lastContact: 'Há 21 dias',
    priority: 'Alta',
    suggestedAction: 'Agendar retorno para atualização clínica',
    pendingItems: [
      { id: 'c5-paulo-pa-001', indicator: 'C5', name: 'Aferição de pressão', due: '10 dias' },
      { id: 'c5-paulo-peso-001', indicator: 'C5', name: 'Peso e altura', due: '10 dias' },
    ],
  },
  {
    id: 'acs-santa-abs-001',
    teamId: '0004234567',
    patientInitials: 'L. F. G.',
    cpf: '***.654.321-**',
    cns: '*** 7210 9834 5621',
    classification: 'absenteismo',
    clinicalConditions: ['C4 — Diabetes', 'C5 — Hipertensão'],
    microArea: '02',
    acsInitials: 'C. R. M.',
    searchReason: 'Sem cuidado válido no ciclo',
    contactStatus: 'Mudança de telefone informada',
    lastContact: 'Há 41 dias',
    priority: 'Crítica',
    suggestedAction: 'Confirmar vínculo territorial com visita',
    allVariablesNegative: false,
    inactiveMonths: 10,
    pendingItems: [
      { id: 'c4-santa-hba1c-001', indicator: 'C4', name: 'Hemoglobina glicada', due: '3 dias' },
      { id: 'c4-santa-pe-001', indicator: 'C4', name: 'Avaliação do pé diabético', due: '3 dias' },
      { id: 'c5-santa-consulta-001', indicator: 'C5', name: 'Consulta', due: '3 dias' },
    ],
    previousPendingItems: [
      { label: 'Hemoglobina glicada', quarter: '1º quadrimestre de 2026' },
      { label: 'Avaliação dos pés', quarter: '3º quadrimestre de 2025' },
    ],
  },
  {
    id: 'acs-andaiá-par-001',
    teamId: '0006234567',
    patientInitials: 'B. R. N.',
    cpf: '***.222.333-**',
    cns: '*** 3301 2290 7721',
    classification: 'parcial',
    clinicalConditions: ['C4 — Diabetes'],
    microArea: '01',
    acsInitials: 'F. D. A.',
    searchReason: 'Hemoglobina glicada pendente',
    contactStatus: 'Contato realizado com familiar',
    lastContact: 'Há 13 dias',
    priority: 'Programada',
    suggestedAction: 'Orientar comparecimento para coleta',
    pendingItems: [
      { id: 'c4-andaia-hba1c-001', indicator: 'C4', name: 'Hemoglobina glicada', due: '16 dias' },
      { id: 'c4-andaia-visita-001', indicator: 'C4', name: 'Visita domiciliar', due: '16 dias' },
    ],
  },
  {
    id: 'acs-irma-abs-001',
    teamId: '0005234567',
    patientInitials: 'R. D. O.',
    cpf: '***.333.444-**',
    cns: '*** 7410 5561 9920',
    classification: 'absenteismo',
    clinicalConditions: ['C4 — Diabetes'],
    microArea: '03',
    acsInitials: 'S. L. Q.',
    searchReason: 'Paciente sem acompanhamento válido',
    contactStatus: 'Endereço precisa ser confirmado',
    lastContact: 'Há 36 dias',
    priority: 'Crítica',
    suggestedAction: 'Validar microárea antes da rota',
    allVariablesNegative: true,
    inactiveMonths: 4,
    pendingItems: [
      { id: 'c4-irma-hba1c-001', indicator: 'C4', name: 'Hemoglobina glicada', due: '6 dias' },
      { id: 'c4-irma-pe-001', indicator: 'C4', name: 'Avaliação do pé diabético', due: '6 dias' },
      { id: 'c4-irma-visita-001', indicator: 'C4', name: 'Visita domiciliar', due: '6 dias' },
    ],
    previousPendingItems: [
      { label: 'Visita domiciliar', quarter: '1º quadrimestre de 2026' },
      { label: 'Hemoglobina glicada', quarter: '1º quadrimestre de 2026' },
    ],
  },
  {
    id: 'acs-urbis-par-001',
    teamId: '0007234567',
    patientInitials: 'P. E. A.',
    cpf: '***.444.555-**',
    cns: '*** 4309 8722 1140',
    classification: 'parcial',
    clinicalConditions: ['C5 — Hipertensão'],
    microArea: '06',
    acsInitials: 'E. V. T.',
    searchReason: 'Aferição de pressão pendente',
    contactStatus: 'Contato orientado pela recepção',
    lastContact: 'Há 11 dias',
    priority: 'Programada',
    suggestedAction: 'Reforçar retorno para aferição',
    pendingItems: [
      { id: 'c5-urbis-pa-001', indicator: 'C5', name: 'Aferição de pressão', due: '14 dias' },
      { id: 'c5-urbis-peso-001', indicator: 'C5', name: 'Peso e altura', due: '14 dias' },
    ],
  },
  {
    id: 'acs-alto-par-001',
    teamId: '0008234567',
    patientInitials: 'M. T. B.',
    cpf: '***.555.666-**',
    cns: '*** 1903 8872 6601',
    classification: 'parcial',
    clinicalConditions: ['C4 — Diabetes', 'C5 — Hipertensão'],
    microArea: '05',
    acsInitials: 'D. O. C.',
    searchReason: 'Visita domiciliar pendente',
    contactStatus: 'Aguardando roteiro da microárea',
    lastContact: 'Há 8 dias',
    priority: 'Programada',
    suggestedAction: 'Incluir no roteiro programado',
    pendingItems: [
      { id: 'c4-alto-pe-001', indicator: 'C4', name: 'Avaliação do pé diabético', due: '20 dias' },
      { id: 'c5-alto-visita-001', indicator: 'C5', name: 'Visita domiciliar', due: '20 dias' },
    ],
  },
  {
    id: 'acs-lagoa-par-001',
    teamId: '0009234567',
    patientInitials: 'S. P. F.',
    cpf: '***.666.777-**',
    cns: '*** 6540 1120 8791',
    classification: 'parcial',
    clinicalConditions: ['C4 — Diabetes', 'C5 — Hipertensão'],
    microArea: '02',
    acsInitials: 'V. A. S.',
    searchReason: 'Consulta e peso pendentes',
    contactStatus: 'Contato realizado',
    lastContact: 'Há 7 dias',
    priority: 'Programada',
    suggestedAction: 'Orientar comparecimento no turno programado',
    pendingItems: [
      { id: 'c5-lagoa-consulta-001', indicator: 'C5', name: 'Consulta', due: '21 dias' },
      { id: 'c4-lagoa-pe-001', indicator: 'C4', name: 'Avaliação do pé diabético', due: '21 dias' },
    ],
  },
  {
    id: 'acs-patagonia-abs-001',
    teamId: '0010234567',
    patientInitials: 'D. L. M.',
    cpf: '***.777.888-**',
    cns: '*** 7760 4512 3012',
    classification: 'absenteismo',
    clinicalConditions: ['C4 — Diabetes', 'C5 — Hipertensão'],
    microArea: '04',
    acsInitials: 'A. C. V.',
    searchReason: 'Não localizado após contato telefônico',
    contactStatus: '3 tentativas sem resposta',
    lastContact: 'Há 39 dias',
    priority: 'Crítica',
    suggestedAction: 'Avaliar visita conjunta com equipe',
    allVariablesNegative: false,
    inactiveMonths: 11,
    pendingItems: [
      { id: 'c4-patag-hba1c-001', indicator: 'C4', name: 'Hemoglobina glicada', due: '5 dias' },
      { id: 'c5-patag-pa-001', indicator: 'C5', name: 'Aferição de pressão', due: '5 dias' },
      { id: 'c5-patag-visita-001', indicator: 'C5', name: 'Visita domiciliar', due: '5 dias' },
    ],
    previousPendingItems: [
      { label: 'Aferição de pressão', quarter: '1º quadrimestre de 2026' },
      { label: 'Visita domiciliar', quarter: '3º quadrimestre de 2025' },
    ],
  },
]

export const ACTIVE_SEARCH_METADATA = {
  origin: 'Importação e-SUS Helper',
  competence: '2º quadrimestre de 2026',
  clinicalScope: 'C4 Diabetes e C5 Hipertensão',
}
