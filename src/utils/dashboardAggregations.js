export const RANKING_METRICS = {
  acompanhamentoParcial: {
    label: 'Acompanhamento parcial',
    description: 'Pacientes com cuidado incompleto',
    tone: 'warning',
    barClass: 'bg-[var(--warning)]',
  },
  zerados: {
    label: 'Absenteísmo',
    description: 'Absenteísmo',
    tone: 'danger',
    barClass: 'bg-[var(--danger)]',
  },
  quaseRegularizados: {
    label: 'Quase regularizados',
    description: 'Próximos da regularização',
    tone: 'success',
    barClass: 'bg-[var(--success)]',
  },
}

export const getDashboardTotals = (teams, situationConfig) => {
  const totals = teams.reduce((acc, team) => ({
    acompanhamentoParcial: acc.acompanhamentoParcial + team.acompanhamentoParcial,
    zerados: acc.zerados + team.zerados,
    quaseRegularizados: acc.quaseRegularizados + team.quaseRegularizados,
  }), {
    acompanhamentoParcial: 0,
    zerados: 0,
    quaseRegularizados: 0,
  })

  const prioritizedPatients = totals.acompanhamentoParcial + totals.zerados + totals.quaseRegularizados
  const situationDistribution = Object.values(situationConfig).map((situation) => ({
    ...situation,
    total: teams.filter((team) => situation.label.toLowerCase() === team.situacao.toLowerCase()).length,
  }))

  return {
    ...totals,
    prioritizedPatients,
    teamsCount: teams.length,
    situationDistribution,
  }
}

export const getTopTeams = (teams, metric, limit = 6) => (
  [...teams].sort((a, b) => b[metric] - a[metric]).slice(0, limit)
)

export const getHighestTeam = (teams, metric) => (
  [...teams].sort((a, b) => b[metric] - a[metric])[0]
)

export const getFilteredTeams = (teams, query) => {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return teams

  return teams.filter((team) => team.name.toLowerCase().includes(normalizedQuery))
}
