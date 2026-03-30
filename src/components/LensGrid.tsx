import type { Lens, LensOutput } from '../types'
import LensColumn from './LensColumn'

interface LensGridProps {
  lenses: Lens[]
  outputs: Record<string, LensOutput>
}

export default function LensGrid({ lenses, outputs }: LensGridProps) {
  return (
    <>
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
