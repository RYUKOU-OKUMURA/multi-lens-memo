interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  'aria-label'?: string
}

/**
 * 共通テキストエリアコンポーネント。
 * ContextPanel・自分メモカラムなどで共用する。
 */
export default function TextInput({
  value,
  onChange,
  placeholder,
  className = '',
  'aria-label': ariaLabel,
}: TextInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className={`w-full h-full min-h-full bg-transparent text-base text-gray-800 resize-none outline-none placeholder-gray-400 leading-relaxed dark:text-gray-300 dark:placeholder-gray-700 ${className}`}
      placeholder={placeholder}
      spellCheck={false}
    />
  )
}
