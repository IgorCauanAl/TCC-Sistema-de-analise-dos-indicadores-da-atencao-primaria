import { useMemo, useState } from 'react'
import { Icons } from '../components/ui/Icons'
import { PageHeader } from '../components/ui/PageHeader'
import { MOCK_PATIENTS } from '../data/mockData'

const getOpportunityTeams = () => {
  const teams = new Map()

  MOCK_PATIENTS.filter((patient) => patient.janelaOportunidadeAction).forEach((patient) => {
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

export const JanelaOportunidadeView = () => {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const teams = useMemo(() => getOpportunityTeams(), [])
  const selectedPatients = useMemo(() => (
    selectedTeam
      ? MOCK_PATIENTS.filter((patient) => patient.ubs === selectedTeam.name && patient.janelaOportunidadeAction)
      : []
  ), [selectedTeam])

  return (
    <div className="space-y-6">
      <PageHeader title="Janela de Oportunidade" subtitle="Pacientes que podem resolver pendências dos indicadores C4 e C5 em uma mesma consulta" />

      <section className="rounded-lg border border-l-4 border-l-blue-600 border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center text-blue-700">
              <Icons.Activity />
              <h2 className="ml-2 text-lg font-semibold">C4 E C5 - Diabético e Hipertenso</h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              Identifica pacientes presentes nos dois indicadores para orientar consultas que resolvam pendências de diabetes e hipertensão no mesmo atendimento.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            {MOCK_PATIENTS.filter((patient) => patient.janelaOportunidadeAction).length} pacientes
          </span>
        </div>
      </section>

      {!selectedTeam && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Selecione a equipe</h3>
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

      {selectedTeam && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Equipe selecionada</p>
              <h2 className="text-xl font-bold text-gray-900">{selectedTeam.name}</h2>
              <p className="text-sm text-gray-500">INE {selectedTeam.ine}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTeam(null)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Voltar para equipes
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Nome', 'CPF', 'Ação recomendada'].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {selectedPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{patient.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{patient.cpf}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.janelaOportunidadeAction}</td>
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
