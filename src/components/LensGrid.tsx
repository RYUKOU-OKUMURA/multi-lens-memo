import type { Lens, LensOutput } from '../types'
import LensColumn from './LensColumn'

const SELF_MEMO_LENS: Lens = {
  id: 'self',
  name: '自分メモ',
  description: '',
  accentColor: 'text-rose-400',
}

const SELF_MEMO_OUTPUT: LensOutput = {
  lensId: 'self',
  content: '',
  status: 'idle',
}

interface LensGridProps {
  lenses: Lens[]
  outputs: Record<string, LensOutput>
  showSelfMemo: boolean
  selfMemo: string
  onSelfMemoChange: (value: string) => void
}

export default function LensGrid({
  lenses,
  outputs,
  showSelfMemo,
  selfMemo,
  onSelfMemoChange,
}: LensGridProps) {
  return (
    <>
      {showSelfMemo && (
        <LensColumn
          lens={SELF_MEMO_LENS}
          output={SELF_MEMO_OUTPUT}
          isSelfMemo
          selfMemoValue={selfMemo}
          onSelfMemoChange={onSelfMemoChange}
        />
      )}
      {lenses.map((lens) => (
        <LensColumn
          key={lens.id}
          lens={lens}
          output={outputs[lens.id] ?? { lensId: lens.id, content: '', status: 'idle' }}
        />
      ))}
    </>
  )
}
