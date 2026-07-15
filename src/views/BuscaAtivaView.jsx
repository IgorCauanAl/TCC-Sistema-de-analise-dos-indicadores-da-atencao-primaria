import { useMemo, useState } from 'react'
import { Icons } from '../components/ui/Icons'
import { PageHeader } from '../components/ui/PageHeader'
import { MOCK_PATIENTS } from '../data/mockData'

const categoryCards = [
  {
    id: 'absenteismo',
    label: 'Pacientes com Absenteísmo',
    helper: 'Prioridade para visita e confirmação de vínculo.',
    color: 'border-l-red-500 text-red-600',
  },
  {
    id: 'parcial',
    label: 'Pacientes com acompanhamento parcial',
    helper: 'Possuem pendências clínicas ou cadastrais.',
    color: 'border-l-yellow-500 text-yellow-600',
  },
]

const filterColumns = [
  { id: 'all', label: 'Todas as colunas' },
  { id: 'name', label: 'Nome' },
  { id: 'cpf', label: 'CPF' },
  { id: 'pendencias', label: 'Pendências' },
]

const getColumnValue = (patient, column) => {
  if (column === 'pendencias') return patient.pendencias.join(' ')
  if (column === 'all') return `${patient.name} ${patient.cpf} ${patient.pendencias.join(' ')}`
  return patient[column] || ''
}

const getTeamSummary = () => {
  const teams = new Map()

  MOCK_PATIENTS.forEach((patient) => {
    if (!teams.has(patient.ubs)) {
      teams.set(patient.ubs, {
        name: patient.ubs,
        ine: patient.ine,
        patients: 0,
      })
    }

    teams.get(patient.ubs).patients += 1
  })

  return [...teams.values()]
}

export const BuscaAtivaView = () => {
  const [teamQuery, setTeamQuery] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [patientQuery, setPatientQuery] = useState('')
  const [filterColumn, setFilterColumn] = useState('all')

  const teams = useMemo(() => getTeamSummary(), [])
  const filteredTeams = useMemo(() => {
    const normalizedQuery = teamQuery.trim().toLowerCase()

    if (!normalizedQuery) return teams

    return teams.filter((team) => (
      team.name.toLowerCase().includes(normalizedQuery) || team.ine.includes(normalizedQuery)
    ))
  }, [teamQuery, teams])

  const selectedTeamPatients = useMemo(() => (
    selectedTeam ? MOCK_PATIENTS.filter((patient) => patient.ubs === selectedTeam.name) : []
  ), [selectedTeam])

  const filteredPatients = useMemo(() => {
    const normalizedQuery = patientQuery.trim().toLowerCase()
    const categoryPatients = selectedTeamPatients.filter((patient) => patient.buscaAtivaStatus === selectedCategory)

    if (!normalizedQuery) return categoryPatients

    return categoryPatients.filter((patient) => (
      getColumnValue(patient, filterColumn).toLowerCase().includes(normalizedQuery)
    ))
  }, [filterColumn, patientQuery, selectedCategory, selectedTeamPatients])

  const handleSelectTeam = (team) => {
    setSelectedTeam(team)
    setSelectedCategory(null)
    setPatientQuery('')
  }

  const handleBackToTeams = () => {
    setSelectedTeam(null)
    setSelectedCategory(null)
    setPatientQuery('')
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setPatientQuery('')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Busca Ativa (ACS)" subtitle="Seleção de equipe, classificação de prioridade e lista territorial de pacientes" />

      {!selectedTeam && (
        <section className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <label className="text-sm font-semibold text-gray-700" htmlFor="team-search">Buscar equipe ou INE</label>
            <div className="mt-2 flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <span className="mr-2 text-gray-400"><Icons.Search /></span>
              <input
                id="team-search"
                type="text"
                value={teamQuery}
                onChange={(event) => setTeamQuery(event.target.value)}
                placeholder="Digite o nome da equipe ou o INE"
                className="w-full border-0 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTeams.map((team) => (
              <button
                key={team.ine}
                type="button"
                onClick={() => handleSelectTeam(team)}
                className="rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-gray-900">{team.name}</h2>
                    <p className="mt-1 text-sm text-gray-500">INE {team.ine}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {team.patients} pacientes
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedTeam && !selectedCategory && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Equipe selecionada</p>
              <h2 className="text-xl font-bold text-gray-900">{selectedTeam.name}</h2>
              <p className="text-sm text-gray-500">INE {selectedTeam.ine}</p>
            </div>
            <button
              type="button"
              onClick={handleBackToTeams}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Voltar para equipes
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {categoryCards.map((category) => {
              const total = selectedTeamPatients.filter((patient) => patient.buscaAtivaStatus === category.id).length

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-lg border border-l-4 border-gray-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md ${category.color}`}
                >
                  <span className="text-sm font-semibold">{category.label}</span>
                  <div className="mt-3 text-3xl font-bold text-gray-900">
                    {total} <span className="text-sm font-normal text-gray-500">pacientes</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{category.helper}</p>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {selectedTeam && selectedCategory && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500">{selectedTeam.name} · INE {selectedTeam.ine}</p>
              <h2 className="text-xl font-bold text-gray-900">
                {categoryCards.find((category) => category.id === selectedCategory)?.label}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleBackToCategories}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Voltar para classificações
              </button>
              <button
                type="button"
                onClick={handleBackToTeams}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Voltar para equipes
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[12rem_1fr]">
              <select
                value={filterColumn}
                onChange={(event) => setFilterColumn(event.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {filterColumns.map((column) => (
                  <option key={column.id} value={column.id}>{column.label}</option>
                ))}
              </select>
              <div className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <span className="mr-2 text-gray-400"><Icons.Search /></span>
                <input
                  type="text"
                  value={patientQuery}
                  onChange={(event) => setPatientQuery(event.target.value)}
                  placeholder="Buscar na lista de pacientes"
                  className="w-full border-0 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Nome', 'CPF', 'Pendências'].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{patient.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{patient.cpf}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {patient.pendencias.map((item) => {
                          const isAcsVisitIssue = item.toLowerCase().includes('não visita do acs')

                          return (
                            <span
                              key={item}
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                isAcsVisitIssue ? 'bg-red-100 text-red-800 ring-1 ring-red-200' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {item}
                            </span>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredPatients.length && (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan="3">
                      Nenhum paciente encontrado para o filtro selecionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
