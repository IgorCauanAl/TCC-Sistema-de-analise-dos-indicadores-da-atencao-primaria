import { useRef, useState } from 'react'
import { Icons } from '../ui/Icons'

export const UploadDropzone = ({ onFilesSelected }) => {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || [])
    if (files.length) onFilesSelected(files)
  }

  return (
    <section
      className={`app-card border-dashed p-8 text-center transition ${isDragging ? 'border-[var(--primary)] bg-[var(--surface-interactive)]' : 'border-[rgba(53,167,184,0.42)]'}`}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        handleFiles(event.dataTransfer.files)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.csv,.xlsx,.xls"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(53,167,184,0.32)] bg-[rgba(53,167,184,0.12)] text-[var(--secondary)]">
        <Icons.Upload />
      </div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Importar relatórios do quadrimestre</h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
        Selecione os relatórios C4 e C5 das equipes. Você poderá conferir, adicionar ou remover arquivos antes de iniciar a importação.
      </p>
      <button type="button" onClick={() => inputRef.current?.click()} className="btn-primary mt-6 px-4 py-2 text-sm font-semibold">
        Selecionar relatórios
      </button>
      <p className="mt-4 text-xs text-[var(--text-muted)]">Os arquivos serão analisados antes da confirmação da importação.</p>
    </section>
  )
}
