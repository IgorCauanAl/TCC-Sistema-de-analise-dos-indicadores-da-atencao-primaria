const numberFormatter = new Intl.NumberFormat('pt-BR')

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const detailedPercentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export const formatNumber = (value) => numberFormatter.format(value)

export const formatPercent = (value) => `${percentFormatter.format(value)}%`

export const formatDetailedPercent = (value) => `${detailedPercentFormatter.format(value)}%`

export const formatPercentagePoints = (value) => {
  const sign = value > 0 ? '+' : ''

  return `${sign}${percentFormatter.format(value)} p.p.`
}

export const formatDateTime = (dateTime) => dateTimeFormatter.format(new Date(dateTime))
