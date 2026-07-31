export const temporalStatusFallbackText = {
  moderado: 'Risco Moderado: atraso apenas no quadrimestre atual',
  alto: 'Risco Alto: atraso procedimental de baixo risco há 1 quadrimestre',
  clinico: 'Risco Clínico: atraso há 1 quadrimestre com pendência crítica',
  absenteismo_recente: 'Absenteísmo Recente: zerado há 1 quadrimestre',
  absenteismo_cronico: 'Absenteísmo Crônico: inativo há mais de 8 meses',
}

const previousQuarterPattern = /1º quadrimestre de 2026/i
const oldQuarterPattern = /(3º quadrimestre de 2025|2025-Q3|Q3-2025)/i

const normalizeText = (value = '') => value
  .normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .toLowerCase()

const getPendingName = (item) => normalizeText(item?.name || item?.label || item || '')
const getPendingIndicator = (item, fallbackIndicator) => item?.indicator || fallbackIndicator

const isCriticalPending = (item, fallbackIndicator) => {
  const name = getPendingName(item)
  const indicator = getPendingIndicator(item, fallbackIndicator)

  if (indicator === 'C4') {
    return name.includes('consulta') || name.includes('pe diabetico') || name.includes('avaliacao dos pes')
  }

  if (indicator === 'C5') {
    return name.includes('consulta') || name.includes('pressao') || name.includes('afericao')
  }

  return name.includes('consulta') || name.includes('pressao') || name.includes('pe diabetico')
}

const isLowRiskProceduralPending = (item) => {
  const name = getPendingName(item)

  return name.includes('peso') || name.includes('altura')
}

const hasPreviousQuarterDelay = (record) => (
  Boolean(record?.previousPendingItems?.length) ||
  record?.delayedQuadrimesters === 1 ||
  record?.historyDelayQuarters === 1 ||
  previousQuarterPattern.test(record?.delayHistorySince || '')
)

const hasOldDelay = (record) => (
  record?.inactiveMonths > 8 ||
  record?.monthsWithoutCare > 8 ||
  record?.delayedMonths > 8 ||
  oldQuarterPattern.test(record?.delayHistorySince || '') ||
  record?.previousPendingItems?.some((item) => oldQuarterPattern.test(item.quarter || ''))
)

const isAbsenteeismRecord = (record) => (
  record?.classification === 'absenteismo' ||
  record?.classification === 'zerado' ||
  record?.allVariablesNegative
)

export const getDelayHistoryStatus = (record, options = {}) => {
  if (record?.delayHistoryStatus) {
    return {
      status: record.delayHistoryStatus,
      text: record.delayHistoryText || temporalStatusFallbackText[record.delayHistoryStatus],
    }
  }

  const pendingItems = options.pendingItems || record?.pendingItems || record?.pendencies || []
  const fallbackIndicator = options.indicator || record?.indicator || record?.indicators?.[0]

  if (isAbsenteeismRecord(record)) {
    if (hasOldDelay(record)) {
      return { status: 'absenteismo_cronico', text: temporalStatusFallbackText.absenteismo_cronico }
    }

    if (record?.allVariablesNegative || pendingItems.length >= 3 || hasPreviousQuarterDelay(record)) {
      return { status: 'absenteismo_recente', text: temporalStatusFallbackText.absenteismo_recente }
    }
  }

  if (hasOldDelay(record)) {
    return { status: 'absenteismo_cronico', text: temporalStatusFallbackText.absenteismo_cronico }
  }

  if (hasPreviousQuarterDelay(record)) {
    if (pendingItems.some((item) => isCriticalPending(item, fallbackIndicator))) {
      return { status: 'clinico', text: temporalStatusFallbackText.clinico }
    }

    if (pendingItems.length > 0 && pendingItems.every(isLowRiskProceduralPending)) {
      return { status: 'alto', text: temporalStatusFallbackText.alto }
    }

    return { status: 'alto', text: temporalStatusFallbackText.alto }
  }

  return { status: 'moderado', text: temporalStatusFallbackText.moderado }
}

export const getTemporalStatusFromDays = () => ({ status: 'moderado', text: temporalStatusFallbackText.moderado })
