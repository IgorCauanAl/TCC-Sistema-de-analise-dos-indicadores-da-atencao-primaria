import { useMemo, useState } from 'react'
import { Icons } from '../components/ui/Icons'
import { PageHeader } from '../components/ui/PageHeader'
import { MOCK_CLINICAL_AUDIT_PATIENTS } from '../data/mockData'

const indicatorCards = [
  {
    id: 'c4',
    label: 'C4 - Diabético',
    helper: 'Auditoria de registros clínicos relacionados ao acompanhamento de diabetes.',
    color: 'border-l-blue-500 text-blue-600',
  },
  {
    id: 'c5',
    label: 'C5 - Hipertenso',
    helper: 'Auditoria de registros clínicos relacionados ao acompanhamento de hipertensão.',
    color: 'border-l-red-500 text-red-600',
  },
]

const getTeamsByIndicator = (indicator) => {
  const teams = new Map()

  MOCK_CLINICAL_AUDIT_PATIENTS.filter((patient) => patient.indicator === indicator).forEach((patient) => {
    if (!teams.has(patient.equipe)) {
      teams.set(patient.equipe, {
        name: patient.equipe,
        ine: patient.ine,
        patients: 0,
      })
    }

    teams.get(patient.equipe).patients += 1
  })

  return [...teams.values()]
}

export const AuditoriaRegistrosClinicosView = () => {
  const [selectedIndicator, setSelectedIndicator] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)

  const indicatorPatients = useMemo(() => (
    selectedIndicator
      ? MOCK_CLINICAL_AUDIT_PATIENTS.filter((patient) => patient.indicator === selectedIndicator)
      : []
  ), [selectedIndicator])

  const teams = useMemo(() => (
    selectedIndicator ? getTeamsByIndicator(selectedIndicator) : []
  ), [selectedIndicator])

  const teamPatients = useMemo(() => (
    selectedTeam
      ? indicatorPatients.filter((patient) => patient.equipe === selectedTeam.name)
      : []
  ), [indicatorPatients, selectedTeam])

  const handleSelectIndicator = (indicator) => {
    setSelectedIndicator(indicator)
    setSelectedTeam(null)
  }

  const handleBackToIndicators = () => {
    setSelectedIndicator(null)
    setSelectedTeam(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Auditoria dos Registros Clínicos" subtitle="Identificação de consultas com registros incompletos para C4 e C5" />

      {!selectedIndicator && (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {indicatorCards.map((indicator) => {
            const total = MOCK_CLINICAL_AUDIT_PATIENTS.filter((patient) => patient.indicator === indicator.id).length

            return (
              <button
                key={indicator.id}
                type="button"
                onClick={() => handleSelectIndicator(indicator.id)}
                className={`rounded-lg border border-l-4 border-gray-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md ${indicator.color}`}
              >
                <div className="flex items-center">
                  <Icons.Activity />
                  <span className="ml-2 text-sm font-semibold">{indicator.label}</span>
                </div>
                <div className="mt-3 text-3xl font-bold text-gray-900">
                  {total} <span className="text-sm font-normal text-gray-500">pacientes</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">{indicator.helper}</p>
              </button>
            )
          })}
        </section>
      )}

      {selectedIndicator && !selectedTeam && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Indicador selecionado</p>
              <h2 className="text-xl font-bold text-gray-900">
                {indicatorCards.find((indicator) => indicator.id === selectedIndicator)?.label}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleBackToIndicators}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Voltar para indicadores
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((team) => (
              <button
                key={team.ine}
                type="button"
                onClick={() => setSelectedTeam(team)}
                className="rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{team.name}</h3>
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

      {selectedIndicator && selectedTeam && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {indicatorCards.find((indicator) => indicator.id === selectedIndicator)?.label} · INE {selectedTeam.ine}
              </p>
              <h2 className="text-xl font-bold text-gray-900">{selectedTeam.name}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Voltar para equipes
              </button>
              <button
                type="button"
                onClick={handleBackToIndicators}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Voltar para indicadores
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Nome', 'CPF', 'Pendências', 'Inteligência'].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {teamPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{patient.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{patient.cpf}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {patient.pendencias.map((item) => (
                          <span key={item} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.inteligencia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
