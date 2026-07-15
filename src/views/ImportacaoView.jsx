import { PageHeader } from '../components/ui/PageHeader'
import { Icons } from '../components/ui/Icons'

export const ImportacaoView = () => (
  <div>
    <PageHeader title="Importação de Relatórios" subtitle="Envio e validação de bases exportadas dos sistemas da APS" />
    <div className="rounded-lg border border-dashed border-blue-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700">
        <Icons.Upload />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">Relatórios pendentes de importação</h2>
      <p className="mt-2 text-sm text-gray-500">Use este módulo para concentrar os arquivos de produção, cadastros e atendimentos antes do processamento dos indicadores.</p>
      <button type="button" className="mt-6 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">Selecionar arquivo</button>
    </div>
  </div>
)
