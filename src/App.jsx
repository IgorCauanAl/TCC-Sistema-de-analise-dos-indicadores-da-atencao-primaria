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

  const menuItems = [
    { id: 'dashboard', label: 'Página Inicial', icon: <Icons.Home /> },
    { id: 'importacao', label: 'Importação de Relatórios', icon: <Icons.Upload /> },
    { id: 'pacientes', label: 'Pacientes', icon: <Icons.User /> },
    { id: 'inconsistencia', label: 'Inconsistência', icon: <Icons.Alert /> },
    { id: 'buscaAtiva', label: 'Busca Ativa (ACS)', icon: <Icons.User /> },
    { id: 'auditoriaRegistros', label: 'Auditoria dos Registros Clínicos', icon: <Icons.Activity /> },
    { id: 'calculoC1', label: 'Cálculo C1 - Mais Acesso', icon: <Icons.Calculator /> },
    { id: 'janelaOportunidade', label: 'Janela de Oportunidade', icon: <Icons.Activity /> },
  ]

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView />
      case 'importacao':
        return <ImportacaoView />
      case 'pacientes':
        return <PacientesView />
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
        return <DashboardView />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeModule={activeModule} menuItems={menuItems} onChangeModule={setActiveModule} />

      <main className="flex-1 overflow-y-auto">
        <header className="flex h-16 items-center justify-between bg-white px-8 shadow-sm">
          <div className="text-sm text-gray-500">Sistema de Apoio à Decisão - SUS</div>
        </header>
        <div className="mx-auto max-w-7xl p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
