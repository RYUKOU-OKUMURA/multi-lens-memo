import { Fragment, useCallback, useRef, useState } from 'react'
import type { Lens, LensOutput } from '../types'
import LensColumn from './LensColumn'
import ResizeHandle from './ResizeHandle'

interface LensGridProps {
  lenses: Lens[]
  outputs: Record<string, LensOutput>
}

export default function LensGrid({ lenses, outputs }: LensGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // flex-grow ratios per lens index; empty = all equal (1 each)
  const [flexGrows, setFlexGrows] = useState<number[]>([])

  const handleResize = useCallback(
    (index: number, delta: number) => {
      const container = containerRef.current
      if (!container) return
      const containerWidth = container.clientWidth
      const n = lenses.length
      setFlexGrows((prev) => {
        const current = prev.length === n ? prev : Array(n).fill(1)
        const totalGrow = current.reduce((a, b) => a + b, 0)
        const deltaGrow = (delta / containerWidth) * totalGrow
        const next = [...current]
        next[index] = Math.max(0.15, next[index] + deltaGrow)
        next[index + 1] = Math.max(0.15, next[index + 1] - deltaGrow)
        return next
      })
    },
    [lenses.length],
  )

  return (
    <div ref={containerRef} className="flex flex-1 overflow-hidden min-w-0">
      {lenses.map((lens, i) => (
        <Fragment key={lens.id}>
          <LensColumn
            lens={lens}
            output={outputs[lens.id] ?? { lensId: lens.id, content: '', status: 'idle' }}
            flexGrow={flexGrows[i] ?? 1}
          />
          {i < lenses.length - 1 && (
            <ResizeHandle onResize={(delta) => handleResize(i, delta)} />
          )}
        </Fragment>
      ))}
    </div>
  )
}
