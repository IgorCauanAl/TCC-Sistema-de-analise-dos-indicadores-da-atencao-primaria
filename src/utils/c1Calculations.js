export const getTotalConsidered = (team) => team.programmedDemand + team.spontaneousDemand

export const calculateC1 = (programmedDemand, spontaneousDemand) => {
  const total = programmedDemand + spontaneousDemand

  if (!total) return 0

  return (programmedDemand / total) * 100
}

export const getTeamResult = (team) => calculateC1(team.programmedDemand, team.spontaneousDemand)

export const getEvolution = (currentResult, previousResult) => currentResult - previousResult

export const getMunicipalSummary = (teams, situations) => {
  const programmedDemand = teams.reduce((sum, team) => sum + team.programmedDemand, 0)
  const spontaneousDemand = teams.reduce((sum, team) => sum + team.spontaneousDemand, 0)
  const totalConsidered = programmedDemand + spontaneousDemand
  const currentResult = calculateC1(programmedDemand, spontaneousDemand)
  const previousResult = teams.reduce((sum, team) => sum + team.previousResult, 0) / Math.max(teams.length, 1)
  const teamsToMonitor = teams.filter((team) => situations[team.situationKey]?.requiresFollowUp).length

  return {
    programmedDemand,
    spontaneousDemand,
    totalConsidered,
    currentResult,
    previousResult,
    evolution: getEvolution(currentResult, previousResult),
    teamsToMonitor,
  }
}
