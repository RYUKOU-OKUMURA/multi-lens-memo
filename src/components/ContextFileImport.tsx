import { useCallback, useRef, type ReactNode } from 'react'
import { readLocalTextFile, ReadLocalTextFileError } from '../lib/readLocalTextFile'

const FILE_ACCEPT = '.md,.txt,.markdown,text/plain,text/markdown'

interface ContextFileImportProps {
  onImported: (text: string) => void
  disabled?: boolean
  children: ReactNode
}

export default function ContextFileImport({
  onImported,
  disabled = false,
  children,
}: ContextFileImportProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const runImport = useCallback(
    async (file: File | undefined) => {
      if (!file || disabled) return
      try {
        const text = await readLocalTextFile(file)
        onImported(text)
      } catch (e) {
        const msg =
          e instanceof ReadLocalTextFileError
            ? e.message
            : e instanceof Error
              ? e.message
              : 'ファイルの読み取りに失敗しました'
        window.alert(msg)
      }
    },
    [disabled, onImported],
  )

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file) void runImport(file)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-none flex justify-end px-3 py-1.5 border-b border-gray-200 dark:border-gray-800">
        <input
          ref={inputRef}
          type="file"
          accept={FILE_ACCEPT}
          className="hidden"
          aria-hidden
          tabIndex={-1}
          onChange={(ev) => {
            const file = ev.target.files?.[0]
            void runImport(file)
            ev.target.value = ''
          }}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={`px-2.5 py-1 text-xs rounded transition-colors ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
          }`}
          aria-label="テキストまたは Markdown ファイルを読み込む"
        >
          ファイルを読み込む
        </button>
      </div>
      <div
        className="flex-1 min-h-0 overflow-y-auto"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {children}
      </div>
    </div>
  )
}
