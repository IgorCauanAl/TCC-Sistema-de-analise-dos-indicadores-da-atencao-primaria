import { MOCK_INDICATORS } from './mockData'

export const DASHBOARD_QUADRIMESTERS = [
  { id: '2026-Q2', label: '2º quadrimestre de 2026' },
  { id: '2026-Q1', label: '1º quadrimestre de 2026' },
]

export const TEAM_SITUATION_CONFIG = {
  'Cuidado Programado Fragilizado': {
    label: 'Cuidado programado fragilizado',
    tone: 'alert',
  },
  Atenção: {
    label: 'Atenção',
    tone: 'warning',
  },
  'Fluxo adequado': {
    label: 'Fluxo adequado',
    tone: 'success',
  },
}

export const DASHBOARD_CONTEXT = {
  status: 'Dados consolidados',
  lastUpdated: '2026-07-25T10:40:00-03:00',
  daysUntilClose: 37,
  prioritizedLabel: 'pacientes priorizados',
  c1PreviousEvolution: 2.4,
}

export const DASHBOARD_INDICATORS = [
  { id: 'c1', label: 'C1 - Mais acesso a APS', shortLabel: 'C1', name: 'Mais acesso a APS', result: 43.3, classification: 'Bom', evolution: 2.4, target: 50 },
  { id: 'c2', label: 'C2 - Cuidado da gestante', shortLabel: 'C2', name: 'Cuidado da gestante', result: 47.8, classification: 'Bom', evolution: 1.6, target: 55 },
  { id: 'c3', label: 'C3 - Cuidado da crianca', shortLabel: 'C3', name: 'Cuidado da crianca', result: 51.2, classification: 'Bom', evolution: 3.1, target: 60 },
  { id: 'c4', label: 'C4 - Diabetes', shortLabel: 'C4', name: 'Diabetes', result: 42.4, classification: 'Regular', evolution: 1.9, target: 50 },
  { id: 'c5', label: 'C5 - Hipertensao', shortLabel: 'C5', name: 'Hipertensao', result: 35.3, classification: 'Atencao', evolution: 0.8, target: 50 },
  { id: 'c6', label: 'C6 - Saude da mulher', shortLabel: 'C6', name: 'Saude da mulher', result: 49.6, classification: 'Bom', evolution: 2.2, target: 55 },
  { id: 'c7', label: 'C7 - Saude bucal', shortLabel: 'C7', name: 'Saude bucal', result: 39.7, classification: 'Regular', evolution: 1.1, target: 50 },
]

export const DASHBOARD_MANAGEMENT_ACTIONS = [
  {
    id: 'priorizar-zerados',
    label: '59 pacientes zerados — Centro I e São Benedito',
    action: 'Priorizar',
    metric: 'zerados',
  },
  {
    id: 'revisar-pendencias',
    label: '64 pendências clínicas — Pressão e consulta C1',
    action: 'Revisar',
    metric: 'acompanhamentoParcial',
  },
  {
    id: 'concluir-regularizados',
    label: '72 conclusões possíveis — Quase regularizados',
    action: 'Concluir',
    metric: 'quaseRegularizados',
  },
]

const clampPercent = (value) => Math.min(Math.max(value, 0), 100)
const parsePercent = (value) => Number.parseInt(value, 10)

const PENDING_LABELS = [
  'Consulta pendente',
  'Pressão não registrada',
  'Visitas pendentes',
  'Peso e altura não registrados',
  'Exame de controle da diabetes pendente',
  'Avaliação dos pés pendente',
]

const getPendingLabel = (text, index) => {
  const normalizedText = text.toLowerCase()

  if (normalizedText.includes('consulta')) return 'Consulta pendente'
  if (normalizedText.includes('pressão') || normalizedText.includes('aferir')) return 'Pressão não registrada'
  if (normalizedText.includes('visita') || normalizedText.includes('busca ativa')) return 'Visitas pendentes'
  if (normalizedText.includes('peso') || normalizedText.includes('altura')) return 'Peso e altura não registrados'
  if (normalizedText.includes('hemoglobina') || normalizedText.includes('diabetes')) return 'Exame de controle da diabetes pendente'
  if (normalizedText.includes('pé') || normalizedText.includes('pés')) return 'Avaliação dos pés pendente'

  return PENDING_LABELS[index % PENDING_LABELS.length]
}

export const DASHBOARD_TEAMS = MOCK_INDICATORS.map((indicator, index) => {
  const c1 = parsePercent(indicator.c1)
  const c4 = parsePercent(indicator.c4)
  const c5 = parsePercent(indicator.c5)

  return {
    id: indicator.equipe.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'),
    name: indicator.equipe,
    c1,
    c2: clampPercent(c1 + 8 - (index % 3) * 2),
    c3: clampPercent(c1 + 12 - (index % 4) * 2),
    c4,
    c5,
    c6: clampPercent(c4 + 10 - (index % 3)),
    c7: clampPercent(c5 + 13 - (index % 4)),
    quaseRegularizados: indicator.quaseRegularizados,
    acompanhamentoParcial: indicator.acompanhamentoParcial,
    zerados: indicator.zerados,
    gargaloPrincipal: indicator.gargaloPrincipal,
    principaisPendencias: getPendingLabel(indicator.gargaloPrincipal, index),
    quantidadePacientes: Number.parseInt(indicator.gargaloPrincipal.match(/\d+/)?.[0] || '0', 10),
    situacao: indicator.risco,
  }
})
