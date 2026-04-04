import TextInput from './TextInput'
import ContextFileImport from './ContextFileImport'

interface ContextPanelProps {
  value: string
  onChange: (value: string) => void
  /** 生成中など、ファイル読み込みを無効にする */
  fileImportDisabled?: boolean
  width?: number
}

export default function ContextPanel({
  value,
  onChange,
  fileImportDisabled = false,
  width = 256,
}: ContextPanelProps) {
  return (
    <section
      className="flex flex-col flex-none bg-white dark:bg-gray-950"
      style={{ width: `${width}px` }}
    >
      <div className="flex-none px-3 py-2 border-b border-gray-200 dark:border-gray-800">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
          コンテキスト
        </span>
        {value.length > 0 && (
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-600">
            {value.length.toLocaleString()} 字
          </span>
        )}
      </div>
      <ContextFileImport onImported={onChange} disabled={fileImportDisabled}>
        <TextInput
          value={value}
          onChange={onChange}
          placeholder={'素材テキストをここに貼り付ける…\n\n文字起こし・Markdown など'}
          className="p-3"
          aria-label="コンテキスト素材入力"
        />
      </ContextFileImport>
    </section>
  )
}
