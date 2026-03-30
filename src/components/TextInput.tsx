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
      className={`w-full h-full min-h-full bg-transparent text-sm text-gray-300 resize-none outline-none placeholder-gray-700 leading-relaxed ${className}`}
      placeholder={placeholder}
      spellCheck={false}
    />
  )
}
