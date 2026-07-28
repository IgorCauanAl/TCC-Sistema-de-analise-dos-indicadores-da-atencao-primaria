import { useState } from 'react'
import { Icons } from './components/ui/Icons'
import { Sidebar } from './components/layout/Sidebar'
import { AuditoriaRegistrosClinicosView } from './views/AuditoriaRegistrosClinicosView'
import { BuscaAtivaView } from './views/BuscaAtivaView'
import { CalculoC1View } from './views/CalculoC1View'
import { DashboardView } from './views/DashboardView'
import { InconsistenciaView } from './views/InconsistenciaView'
import { ImportacaoView } from './views/ImportacaoView'
import { JanelaOportunidadeView } from './views/JanelaOportunidadeView'
import { PacientesView } from './views/PacientesView'

export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard')
  const [initialPatientClassification, setInitialPatientClassification] = useState(null)

  const menuItems = [
    { id: 'dashboard', label: 'Página Inicial', icon: <Icons.Home /> },
    { id: 'importacao', label: 'Importação de Relatórios', icon: <Icons.Upload /> },
    { id: 'pacientes', label: 'Pacientes', icon: <Icons.User /> },
    { id: 'inconsistencia', label: 'Inconsistências', icon: <Icons.Alert /> },
    { id: 'buscaAtiva', label: 'Busca Ativa (ACS)', icon: <Icons.User /> },
    { id: 'auditoriaRegistros', label: 'Auditoria dos Registros Clínicos', icon: <Icons.Activity /> },
    { id: 'calculoC1', label: 'Cálculo C1 - Mais Acesso', icon: <Icons.Calculator /> },
    { id: 'janelaOportunidade', label: 'Janela de Oportunidade', icon: <Icons.Activity /> },
  ]

  const handleChangeModule = (moduleId) => {
    setInitialPatientClassification(null)
    setActiveModule(moduleId)
  }

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenC1={() => setActiveModule('calculoC1')}
            onOpenPatients={(classification) => {
              setInitialPatientClassification(classification)
              setActiveModule('pacientes')
            }}
          />
        )
      case 'importacao':
        return <ImportacaoView onOpenInconsistencies={() => setActiveModule('inconsistencia')} />
      case 'pacientes':
        return <PacientesView initialClassification={initialPatientClassification} onOpenActiveSearch={() => setActiveModule('buscaAtiva')} />
      case 'inconsistencia':
        return <InconsistenciaView />
      case 'buscaAtiva':
        return <BuscaAtivaView />
      case 'auditoriaRegistros':
        return <AuditoriaRegistrosClinicosView />
      case 'calculoC1':
        return <CalculoC1View />
      case 'janelaOportunidade':
        return <JanelaOportunidadeView />
      default:
        return (
          <DashboardView
            onOpenC1={() => setActiveModule('calculoC1')}
            onOpenPatients={(classification) => {
              setInitialPatientClassification(classification)
              setActiveModule('pacientes')
            }}
          />
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)] font-sans text-[var(--text-primary)]">
      <Sidebar activeModule={activeModule} menuItems={menuItems} onChangeModule={handleChangeModule} />

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-[var(--border)] bg-white px-5 md:px-8">
          <div className="text-base font-medium text-[var(--text-primary)]">Sistema de Apoio à Decisão - SUS</div>
          <div className="hidden items-center gap-4 sm:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d7e5f8] bg-[#f1f7ff] text-[var(--primary)]">
              <Icons.User />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Gestora APS</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Atenção Primária</p>
            </div>
            <div className="h-8 w-px bg-[var(--border)]" aria-hidden="true" />
            <div className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--text-primary)]" aria-hidden="true">
              <Icons.Logout />
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1440px] p-5 md:p-8 xl:px-10 2xl:max-w-[1560px]">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
