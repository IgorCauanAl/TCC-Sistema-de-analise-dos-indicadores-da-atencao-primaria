import { DASHBOARD_CONTEXT, DASHBOARD_INDICATORS, DASHBOARD_MANAGEMENT_ACTIONS, DASHBOARD_QUADRIMESTERS, DASHBOARD_TEAMS, TEAM_SITUATION_CONFIG } from '../data/dashboardSituationData'

export const getDashboardQuadrimesters = () => DASHBOARD_QUADRIMESTERS

export const getDashboardSituation = () => ({
  context: DASHBOARD_CONTEXT,
  indicators: DASHBOARD_INDICATORS,
  teams: DASHBOARD_TEAMS,
  managementActions: DASHBOARD_MANAGEMENT_ACTIONS,
  situationConfig: TEAM_SITUATION_CONFIG,
})
