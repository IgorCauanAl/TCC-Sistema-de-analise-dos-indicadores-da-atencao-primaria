import { useMemo, useState } from 'react'
import { Icons } from '../components/ui/Icons'
import { PageHeader } from '../components/ui/PageHeader'
import { MOCK_INCONSISTENCY_PATIENTS } from '../data/mockData'

const inconsistencyCards = [
  {
    id: 'duplicado',
    label: 'CPF duplicado',
    helper: 'Pacientes encontrados com o mesmo CPF em equipes diferentes.',
    color: 'border-l-orange-500 text-orange-600',
  },
  {
    id: 'sem_cpf',
    label: 'Sem CPF',
    helper: 'Pacientes cadastrados sem CPF informado.',
    color: 'border-l-red-500 text-red-600',
  },
]

const filterColumns = [
  { id: 'all', label: 'Todas as colunas' },
  { id: 'name', label: 'Nome' },
  { id: 'cpf', label: 'CPF' },
  { id: 'equipe', label: 'Equipe' },
]

const getSearchValue = (patient, column) => {
  const cpf = patient.cpf || 'Sem CPF'

  if (column === 'all') return `${patient.name} ${cpf} ${patient.equipe} ${patient.ine}`
  if (column === 'cpf') return cpf
  return patient[column] || ''
}

const getDuplicatedCpfGroups = () => {
  const groups = new Map()

  MOCK_INCONSISTENCY_PATIENTS.filter((patient) => patient.cpf).forEach((patient) => {
    if (!groups.has(patient.cpf)) groups.set(patient.cpf, [])
    groups.get(patient.cpf).push(patient)
  })

  return [...groups.entries()]
    .filter(([, patients]) => patients.length > 1)
    .map(([cpf, patients]) => ({ cpf, patients }))
}

export const InconsistenciaView = () => {
  const [selectedType, setSelectedType] = useState(null)
  const [query, setQuery] = useState('')
  const [filterColumn, setFilterColumn] = useState('all')

  const duplicatedGroups = useMemo(() => getDuplicatedCpfGroups(), [])
  const withoutCpfPatients = useMemo(() => MOCK_INCONSISTENCY_PATIENTS.filter((patient) => !patient.cpf), [])

  const filteredDuplicatedGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return duplicatedGroups

    return duplicatedGroups.filter((group) => (
      group.patients.some((patient) => getSearchValue(patient, filterColumn).toLowerCase().includes(normalizedQuery))
    ))
  }, [duplicatedGroups, filterColumn, query])

  const filteredWithoutCpfPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return withoutCpfPatients

    return withoutCpfPatients.filter((patient) => (
      getSearchValue(patient, filterColumn).toLowerCase().includes(normalizedQuery)
    ))
  }, [filterColumn, query, withoutCpfPatients])

  const handleSelectType = (type) => {
    setSelectedType(type)
    setQuery('')
    setFilterColumn('all')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Inconsistência" subtitle="Auditoria de cadastros com CPF duplicado ou ausente" />

      {!selectedType && (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {inconsistencyCards.map((card) => {
            const total = card.id === 'duplicado' ? duplicatedGroups.length : withoutCpfPatients.length

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleSelectType(card.id)}
                className={`rounded-lg border border-l-4 border-gray-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md ${card.color}`}
              >
                <div className="flex items-center">
                  <Icons.Alert />
                  <span className="ml-2 text-sm font-semibold">{card.label}</span>
                </div>
                <div className="mt-3 text-3xl font-bold text-gray-900">
                  {total} <span className="text-sm font-normal text-gray-500">{card.id === 'duplicado' ? 'CPFs' : 'pacientes'}</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">{card.helper}</p>
              </button>
            )
          })}
        </section>
      )}

      {selectedType && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Inconsistência selecionada</p>
              <h2 className="text-xl font-bold text-gray-900">
                {inconsistencyCards.find((card) => card.id === selectedType)?.label}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setSelectedType(null)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Voltar para inconsistências
            </button>
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
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar na lista de inconsistências"
                  className="w-full border-0 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {selectedType === 'duplicado' && (
            <div className="space-y-4">
              {filteredDuplicatedGroups.map((group) => (
                <article key={group.cpf} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold text-gray-900">CPF {group.cpf}</h3>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                      {group.patients.length} cadastros
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {group.patients.map((patient) => (
                      <div key={patient.id} className="rounded-md border border-orange-100 bg-orange-50/40 p-4">
                        <p className="font-semibold text-gray-900">{patient.name}</p>
                        <p className="mt-2 text-sm text-gray-600">Equipe de origem: {patient.equipe}</p>
                        <p className="mt-1 text-sm text-gray-500">INE {patient.ine}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
              {!filteredDuplicatedGroups.length && (
                <div className="rounded-lg border border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-500 shadow-sm">
                  Nenhum CPF duplicado encontrado para o filtro selecionado.
                </div>
              )}
            </div>
          )}

          {selectedType === 'sem_cpf' && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Nome', 'CPF', 'Equipe de origem', 'INE'].map((header) => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredWithoutCpfPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{patient.name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-red-700">Sem CPF</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{patient.equipe}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{patient.ine}</td>
                    </tr>
                  ))}
                  {!filteredWithoutCpfPatients.length && (
                    <tr>
                      <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan="4">
                        Nenhum paciente sem CPF encontrado para o filtro selecionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
