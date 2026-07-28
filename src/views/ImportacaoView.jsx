import { useEffect, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { ImportTabs } from '../components/importacao/ImportTabs'
import { UploadDropzone } from '../components/importacao/UploadDropzone'
import { ImportQueueTable } from '../components/importacao/ImportQueueTable'
import { FileProgressTable } from '../components/importacao/FileProgressTable'
import { ImportSummaryCards } from '../components/importacao/ImportSummaryCards'
import { ImportResultTable } from '../components/importacao/ImportResultTable'
import { QuarterConference } from '../components/importacao/QuarterConference'
import { ImportedReportsTable } from '../components/importacao/ImportedReportsTable'
import { ProblemReportsTable } from '../components/importacao/ProblemReportsTable'
import { ReportDetailsDrawer } from '../components/importacao/ReportDetailsDrawer'
import { EmptyState } from '../components/importacao/EmptyState'
import {
  DEMO_SELECTED_FILES,
  IMPORT_STEPS,
  IMPORT_TEAMS,
  IMPORTED_REPORTS,
  PROBLEM_REPORTS,
  QUARTER_CONFERENCE,
} from '../data/importReportsData'

const importSummary = {
  received: 10,
  imported: 8,
  warning: 1,
  failed: 1,
}

const buildQueueItem = (file, index) => {
  const demo = DEMO_SELECTED_FILES[index % DEMO_SELECTED_FILES.length]
  const fileName = file.name || demo.fileName
  const normalizedName = fileName.toLowerCase()

  if (!normalizedName.includes('c4') && !normalizedName.includes('c5')) {
    return { ...demo, id: `${demo.id}-${Date.now()}-${index}`, fileName, report: 'Não identificado', quarter: '—', teamId: null, validation: 'invalid' }
  }

  return {
    ...demo,
    id: `${demo.id}-${Date.now()}-${index}`,
    fileName,
    report: normalizedName.includes('c5') ? 'C5 — Hipertensão' : 'C4 — Diabetes',
    validation: demo.validation === 'invalid' ? 'ready' : demo.validation,
  }
}

const getImportableFiles = (files) => files.filter((file) => ['ready', 'warning', 'duplicate'].includes(file.validation) && file.teamId)

export const ImportacaoView = ({ onOpenInconsistencies }) => {
  const [activeTab, setActiveTab] = useState('prepare')
  const [queueFiles, setQueueFiles] = useState([])
  const [importStatus, setImportStatus] = useState('completed')
  const [progressFiles, setProgressFiles] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [problemReports, setProblemReports] = useState(PROBLEM_REPORTS)
  const [filters, setFilters] = useState({
    query: '',
    indicator: 'all',
    quarter: 'all',
    team: 'all',
    result: 'all',
    date: '',
  })

  const selectedTeam = selectedReport ? IMPORT_TEAMS.find((team) => team.id === selectedReport.teamId) : null

  useEffect(() => {
    if (importStatus !== 'processing') return undefined

    const timer = window.setInterval(() => {
      setProgressFiles((currentFiles) => {
        const nextFiles = currentFiles.map((file) => {
          if (file.result !== 'processing' && file.result !== 'queued') return file

          const nextProgress = Math.min(file.progress + file.increment, 100)
          const stepIndex = Math.min(Math.floor(nextProgress / 20), IMPORT_STEPS.length - 1)
          const finished = nextProgress === 100
          const failed = finished && file.validation === 'duplicate'

          return {
            ...file,
            progress: nextProgress,
            currentStep: IMPORT_STEPS[stepIndex],
            result: finished ? (failed ? 'notImported' : file.validation === 'warning' ? 'importedWithWarnings' : 'imported') : 'processing',
          }
        })

        if (nextFiles.every((file) => file.progress === 100)) {
          window.clearInterval(timer)
          window.setTimeout(() => setImportStatus('completed'), 300)
        }

        return nextFiles
      })
    }, 650)

    return () => window.clearInterval(timer)
  }, [importStatus])

  const handleFilesSelected = (files) => {
    const selected = files.length ? files.map(buildQueueItem) : DEMO_SELECTED_FILES
    setQueueFiles((current) => [...current, ...selected])
    setImportStatus('selected')
  }

  const handleSetTeam = (fileId, teamId) => {
    setQueueFiles((files) => files.map((file) => (
      file.id === fileId
        ? { ...file, teamId, validation: 'warning', manualTeam: true }
        : file
    )))
  }

  const handleStartImport = () => {
    const importableFiles = getImportableFiles(queueFiles)
    if (!importableFiles.length) return

    setProgressFiles(importableFiles.map((file, index) => ({
      ...file,
      currentStep: index > 1 ? 'Aguardando' : IMPORT_STEPS[0],
      progress: 0,
      increment: index === 0 ? 13 : index === 1 ? 16 : 10,
      result: index > 1 ? 'queued' : 'processing',
    })))
    setImportStatus('processing')
  }

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Importação de Relatórios"
        subtitle="Envio, validação e conferência dos relatórios utilizados no processamento dos indicadores."
      />

      <ImportTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'prepare' && (
        <div className="space-y-6">
          {importStatus === 'completed' && (
            <div className="space-y-4">
              <ImportSummaryCards summary={importSummary} />
              <ImportResultTable reports={IMPORTED_REPORTS.slice(0, 3)} teams={IMPORT_TEAMS} onDetails={setSelectedReport} />
              <UploadDropzone onFilesSelected={handleFilesSelected} />
            </div>
          )}

          {importStatus === 'idle' && <UploadDropzone onFilesSelected={handleFilesSelected} />}

          {importStatus === 'selected' && queueFiles.length > 0 && (
            <ImportQueueTable
              files={queueFiles}
              teams={IMPORT_TEAMS}
              onFilesSelected={handleFilesSelected}
              onRemove={(fileId) => setQueueFiles((files) => files.filter((file) => file.id !== fileId))}
              onClear={() => {
                setQueueFiles([])
                setImportStatus('idle')
              }}
              onSetTeam={handleSetTeam}
              onImport={handleStartImport}
            />
          )}

          {importStatus === 'processing' && <FileProgressTable files={progressFiles} />}

          <QuarterConference rows={QUARTER_CONFERENCE} />
        </div>
      )}

      {activeTab === 'imported' && (
        <ImportedReportsTable
          reports={IMPORTED_REPORTS}
          teams={IMPORT_TEAMS}
          filters={filters}
          onFilterChange={handleFilterChange}
          onDetails={setSelectedReport}
        />
      )}

      {activeTab === 'problems' && (
        problemReports.length ? (
          <ProblemReportsTable
            reports={problemReports}
            onReview={() => setActiveTab('prepare')}
            onRemove={(reportId) => setProblemReports((reports) => reports.filter((report) => report.id !== reportId))}
          />
        ) : (
          <EmptyState title="Nenhum relatório com problema" description="Os relatórios que exigirem correção ou revisão aparecerão aqui." />
        )
      )}

      <ReportDetailsDrawer
        report={selectedReport}
        team={selectedTeam}
        onClose={() => setSelectedReport(null)}
        onOpenInconsistencies={() => {
          setSelectedReport(null)
          onOpenInconsistencies()
        }}
      />
    </div>
  )
}
