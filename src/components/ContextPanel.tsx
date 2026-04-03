import TextInput from './TextInput'

interface ContextPanelProps {
  value: string
  onChange: (value: string) => void
}

export default function ContextPanel({ value, onChange }: ContextPanelProps) {
  return (
    <section className="flex flex-col w-64 flex-none bg-white border-r border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="flex-none px-3 py-2 border-b border-gray-200 dark:border-gray-800">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
          コンテキスト
        </span>
        {value.length > 0 && (
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-600">
            {value.length.toLocaleString()} 字
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <TextInput
          value={value}
          onChange={onChange}
          placeholder={'素材テキストをここに貼り付ける…\n\n文字起こし・Markdown など'}
          className="p-3"
          aria-label="コンテキスト素材入力"
        />
      </div>
    </section>
  )
}
