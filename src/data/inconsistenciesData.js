export const IMPORT_AUDIT_METADATA = {
  lastImportAnalyzedAt: '25/07/2026 às 09:18',
  source: 'e-SUS Helper',
  treatment: 'Revisão manual',
}

export const MISSING_CPF_RECORDS = [
  {
    id: 'missing-cpf-urbis-ii-01',
    patientName: 'Mariana P. C.',
    cns: '***.742.981-**',
    team: 'ESF Urbis II',
    ine: '0007234567',
    origin: 'e-SUS Helper',
    importedAt: '25/07/2026 às 09:18',
  },
  {
    id: 'missing-cpf-alto-maron-01',
    patientName: 'José N. F.',
    cns: '***.315.640-**',
    team: 'ESF Alto Maron',
    ine: '0008234567',
    origin: 'e-SUS Helper',
    importedAt: '25/07/2026 às 09:18',
  },
  {
    id: 'missing-cpf-lagoa-01',
    patientName: 'Helena R. T.',
    cns: '***.584.203-**',
    team: 'ESF Lagoa das Flores',
    ine: '0009234567',
    origin: 'e-SUS Helper',
    importedAt: '25/07/2026 às 09:18',
  },
  {
    id: 'missing-cpf-patagonia-01',
    patientName: 'Márcio V. L.',
    cns: '***.869.112-**',
    team: 'ESF Patagônia',
    ine: '0010234567',
    origin: 'e-SUS Helper',
    importedAt: '25/07/2026 às 09:18',
  },
]

export const HOMONYM_GROUPS = [
  {
    id: 'homonym-ana-c-s',
    displayName: 'Ana C. S.',
    records: [
      { id: 'ana-c-s-01', name: 'Ana C. S.', team: 'ESF Centro I', ine: '0001234567' },
      { id: 'ana-c-s-02', name: 'Ana C. S.', team: 'ESF São Paulo', ine: '0003234567' },
    ],
    matchingFields: ['Nome completo', 'Sexo'],
    attentionPoint: 'Data de nascimento divergente.',
    origin: 'e-SUS Helper',
    importedAt: '25/07/2026 às 09:18',
    treatment: 'Conferência manual',
  },
  {
    id: 'homonym-carlos-m-o',
    displayName: 'Carlos M. O.',
    records: [
      { id: 'carlos-m-o-01', name: 'Carlos M. O.', team: 'ESF São Benedito', ine: '0002234567' },
      { id: 'carlos-m-o-02', name: 'Carlos M. O.', team: 'ESF Andaiá', ine: '0006234567' },
    ],
    matchingFields: ['Nome completo', 'Data de nascimento'],
    attentionPoint: 'CNS e equipe divergentes.',
    origin: 'e-SUS Helper',
    importedAt: '25/07/2026 às 09:18',
    treatment: 'Conferência manual',
  },
  {
    id: 'homonym-maria-r-p',
    displayName: 'Maria R. P.',
    records: [
      { id: 'maria-r-p-01', name: 'Maria R. P.', team: 'ESF Irmã Dulce', ine: '0005234567' },
      { id: 'maria-r-p-02', name: 'Maria R. P.', team: 'ESF Urbis II', ine: '0007234567' },
    ],
    matchingFields: ['Nome completo'],
    attentionPoint: 'Cadastro precisa de conferência manual.',
    origin: 'e-SUS Helper',
    importedAt: '25/07/2026 às 09:18',
    treatment: 'Conferência manual',
  },
]
