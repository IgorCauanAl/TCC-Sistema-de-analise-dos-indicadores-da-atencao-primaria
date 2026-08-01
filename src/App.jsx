import { useCallback, useEffect, useMemo, useState } from 'react'
import { Icons } from './components/ui/Icons'
import { Sidebar } from './components/layout/Sidebar'
import { AuditoriaRegistrosClinicosView } from './views/AuditoriaRegistrosClinicosView'
import { CalculoC1View } from './views/CalculoC1View'
import { DashboardView } from './views/DashboardView'
import { InconsistenciaView } from './views/InconsistenciaView'
import { ImportacaoView } from './views/ImportacaoView'
import { JanelaOportunidadeView } from './views/JanelaOportunidadeView'
import { ModuloHistorico } from './views/ModuloHistorico'
import { PacientesView } from './views/PacientesView'

export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard')
  const [previousModule, setPreviousModule] = useState(null)
  const [initialPatientClassification, setInitialPatientClassification] = useState(null)
  const [auditHistoryContext, setAuditHistoryContext] = useState(null)
  const [dashboardState, setDashboardState] = useState({})
  const [navigationMessage, setNavigationMessage] = useState('')
  const [isShortcutDialogOpen, setIsShortcutDialogOpen] = useState(false)

  const menuItems = useMemo(() => [
    { id: 'dashboard', label: 'Página Inicial', icon: <Icons.Home /> },
    { id: 'importacao', label: 'Importação de Relatórios', icon: <Icons.Upload /> },
    { id: 'pacientes', label: 'Pacientes', icon: <Icons.User /> },
    { id: 'historicoAuditoria', label: 'Histórico de Auditoria', icon: <Icons.Calendar /> },
    { id: 'inconsistencia', label: 'Inconsistências', icon: <Icons.Alert /> },
    { id: 'auditoriaRegistros', label: 'Auditoria dos Registros Clínicos', icon: <Icons.Activity /> },
    { id: 'calculoC1', label: 'Cálculo C1 - Mais Acesso', icon: <Icons.Calculator /> },
    { id: 'janelaOportunidade', label: 'Janela de Oportunidade', icon: <Icons.Activity /> },
  ], [])

  const activeMenuItem = useMemo(
    () => menuItems.find((item) => item.id === activeModule) || menuItems[0],
    [activeModule, menuItems],
  )

  const shortcutItems = useMemo(() => menuItems.slice(0, 8), [menuItems])

  const navigateToModule = useCallback((moduleId, source = 'menu') => {
    if (moduleId === activeModule) {
      setNavigationMessage(`${activeMenuItem.label} já está aberta.`)
      return
    }

    const nextModule = menuItems.find((item) => item.id === moduleId)

    setInitialPatientClassification(null)
    setAuditHistoryContext(null)
    setPreviousModule(activeModule)
    setActiveModule(moduleId)
    setNavigationMessage(source === 'shortcut' ? `Atalho aberto: ${nextModule?.label || 'tela selecionada'}.` : `Tela aberta: ${nextModule?.label || 'tela selecionada'}.`)
  }, [activeMenuItem.label, activeModule, menuItems])

  const handleChangeModule = (moduleId) => {
    navigateToModule(moduleId)
  }

  const handleReturnToPreviousModule = useCallback(() => {
    if (!previousModule) return

    const currentModule = activeModule
    const previousItem = menuItems.find((item) => item.id === previousModule)

    setInitialPatientClassification(null)
    setAuditHistoryContext(null)
    setActiveModule(previousModule)
    setPreviousModule(currentModule)
    setNavigationMessage(`Retorno para ${previousItem?.label || 'tela anterior'}.`)
  }, [activeModule, menuItems, previousModule])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      const isTyping = ['INPUT', 'SELECT', 'TEXTAREA'].includes(target?.tagName) || target?.isContentEditable

      if (event.key === 'Escape' && isShortcutDialogOpen) {
        setIsShortcutDialogOpen(false)
        return
      }

      if (isTyping) return

      if (event.key === '?' || (event.shiftKey && event.key === '/')) {
        event.preventDefault()
        setIsShortcutDialogOpen(true)
        return
      }

      if (!event.altKey) return

      const shortcutIndex = Number.parseInt(event.key, 10)
      const targetItem = Number.isInteger(shortcutIndex) ? shortcutItems[shortcutIndex - 1] : null

      if (!targetItem) return

      event.preventDefault()
      navigateToModule(targetItem.id, 'shortcut')
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isShortcutDialogOpen, navigateToModule, shortcutItems])

  useEffect(() => {
    if (!navigationMessage) return undefined

    const timer = window.setTimeout(() => setNavigationMessage(''), 5000)

    return () => window.clearTimeout(timer)
  }, [navigationMessage])

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardView
            dashboardState={dashboardState}
            onDashboardStateChange={setDashboardState}
            onOpenC1={() => navigateToModule('calculoC1')}
            onOpenPatients={(classification) => {
              setInitialPatientClassification(classification)
              setPreviousModule(activeModule)
              setActiveModule('pacientes')
              setNavigationMessage('Tela aberta: Pacientes.')
            }}
          />
        )
      case 'importacao':
        return <ImportacaoView onOpenInconsistencies={() => navigateToModule('inconsistencia')} />
      case 'pacientes':
        return (
          <PacientesView
            initialClassification={initialPatientClassification}
            onOpenAuditHistory={(context) => {
              setAuditHistoryContext(context)
              setPreviousModule(activeModule)
              setActiveModule('historicoAuditoria')
              setNavigationMessage('Tela aberta: Histórico de Auditoria.')
            }}
          />
        )
      case 'historicoAuditoria':
        return (
          <ModuloHistorico
            initialQuarter={auditHistoryContext?.quarter || null}
            initialPatientName={auditHistoryContext?.patientName || null}
          />
        )
      case 'inconsistencia':
        return <InconsistenciaView />
      case 'auditoriaRegistros':
        return <AuditoriaRegistrosClinicosView />
      case 'calculoC1':
        return <CalculoC1View />
      case 'janelaOportunidade':
        return <JanelaOportunidadeView />
      default:
        return (
          <DashboardView
            dashboardState={dashboardState}
            onDashboardStateChange={setDashboardState}
            onOpenC1={() => navigateToModule('calculoC1')}
            onOpenPatients={(classification) => {
              setInitialPatientClassification(classification)
              setPreviousModule(activeModule)
              setActiveModule('pacientes')
              setNavigationMessage('Tela aberta: Pacientes.')
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
          <div>
            <div className="text-base font-medium text-[var(--text-primary)]">Sistema de Apoio à Decisão - SUS</div>
            <p className="mt-1 text-sm font-semibold text-[var(--text-secondary)]">Tela atual: {activeMenuItem.label}</p>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            {previousModule && (
              <button type="button" onClick={handleReturnToPreviousModule} className="btn-secondary px-3 py-2 text-sm font-semibold">
                Voltar para tela anterior
              </button>
            )}
            <button type="button" onClick={() => setIsShortcutDialogOpen(true)} className="btn-secondary px-3 py-2 text-sm font-semibold" aria-haspopup="dialog">
              Atalhos
            </button>
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

      {navigationMessage && (
        <div className="fixed bottom-5 right-5 z-40 max-w-md rounded-xl border border-[rgba(22,103,232,0.24)] bg-white p-4 text-sm shadow-2xl" role="status" aria-live="polite">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-[var(--text-primary)]">{navigationMessage}</span>
            {previousModule && (
              <button type="button" onClick={handleReturnToPreviousModule} className="text-sm font-semibold text-[var(--primary-dark)] hover:underline">
                Desfazer
              </button>
            )}
          </div>
        </div>
      )}

      {isShortcutDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(14,27,51,0.28)] p-5" role="dialog" aria-modal="true" aria-labelledby="shortcut-dialog-title">
          <section className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--primary-dark)]">Navegação rápida</p>
                <h2 id="shortcut-dialog-title" className="mt-2 text-xl font-semibold text-[var(--text-primary)]">Atalhos do sistema</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Use estes atalhos para abrir telas frequentes sem depender do menu lateral.</p>
              </div>
              <button type="button" onClick={() => setIsShortcutDialogOpen(false)} className="btn-secondary px-3 py-2 text-sm font-semibold">
                Fechar
              </button>
            </div>

            <dl className="mt-5 divide-y divide-[var(--border-subtle)] rounded-xl border border-[var(--border)]">
              {shortcutItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[6rem_1fr] items-center gap-4 px-4 py-3">
                  <dt className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-2 py-1 text-center text-sm font-semibold text-[var(--primary-dark)]">Alt + {index + 1}</dt>
                  <dd className="text-sm font-medium text-[var(--text-primary)]">{item.label}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[6rem_1fr] items-center gap-4 px-4 py-3">
                <dt className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-2 py-1 text-center text-sm font-semibold text-[var(--primary-dark)]">?</dt>
                <dd className="text-sm font-medium text-[var(--text-primary)]">Abrir esta lista de atalhos</dd>
              </div>
              <div className="grid grid-cols-[6rem_1fr] items-center gap-4 px-4 py-3">
                <dt className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-2 py-1 text-center text-sm font-semibold text-[var(--primary-dark)]">Esc</dt>
                <dd className="text-sm font-medium text-[var(--text-primary)]">Fechar diálogos abertos</dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </div>
  )
}
