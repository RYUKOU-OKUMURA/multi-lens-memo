import type { AppState } from '../types'

const TITLE_MAX = 80
const MATERIAL_EXCERPT_MAX = 100

function formatDateForFilename(date: Date): string {
  const yyyy = date.getFullYear()
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const HH = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${MM}-${dd}_${HH}${mm}`
}

/** Local calendar date YYYY-MM-DD */
function formatLocalDateOnly(date: Date): string {
  const yyyy = date.getFullYear()
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${MM}-${dd}`
}

/** First non-empty line, trimmed, max TITLE_MAX chars; "無題" if no material */
function deriveDocumentTitle(context: string): string {
  const first = context
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l.length > 0)
  if (!first) return '無題'
  if (first.length <= TITLE_MAX) return first
  return `${first.slice(0, TITLE_MAX)}…`
}

/** One-line excerpt for 素材: （...） — first line, max ~100 chars; 「なし」 if empty */
function deriveMaterialExcerpt(context: string): string {
  const trimmed = context.trim()
  if (!trimmed) return 'なし'
  const firstLine = trimmed.split(/\r?\n/)[0].trim()
  if (firstLine.length <= MATERIAL_EXCERPT_MAX) return firstLine
  return `${firstLine.slice(0, MATERIAL_EXCERPT_MAX)}…`
}

export function buildMarkdown(state: AppState, exportedAt: Date = new Date()): string {
  const lines: string[] = []

  const docTitle = deriveDocumentTitle(state.context)
  const materialExcerpt = deriveMaterialExcerpt(state.context)

  lines.push(`# 多視点メモ: ${docTitle}`)
  lines.push(`生成日: ${formatLocalDateOnly(exportedAt)}`)
  lines.push(`素材: （${materialExcerpt}）`)
  lines.push('')
  lines.push('---')
  lines.push('')

  const materialFull = state.context.trim()
  if (materialFull) {
    lines.push('## 素材')
    lines.push('')
    lines.push(materialFull)
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  const lensBlocks: { name: string; content: string }[] = []
  for (const lens of state.lenses) {
    const output = state.outputs[lens.id]
    if (!output || (output.status !== 'done' && output.status !== 'streaming')) continue
    const text = output.content.trim()
    if (!text) continue
    lensBlocks.push({ name: lens.name, content: text })
  }

  const selfText = state.selfMemo.trim()

  if (selfText) {
    lines.push('## 自分のメモ')
    lines.push('')
    lines.push(selfText)
    lines.push('')
    if (lensBlocks.length > 0) {
      lines.push('---')
      lines.push('')
    }
  }

  for (const block of lensBlocks) {
    lines.push(`## ${block.name}`)
    lines.push('')
    lines.push(block.content)
    lines.push('')
  }

  return lines.join('\n').replace(/\s+$/, '\n')
}

export function downloadMarkdown(state: AppState): void {
  const now = new Date()
  const content = buildMarkdown(state, now)
  const filename = `多視点メモ_${formatDateForFilename(now)}.md`
  const blob = new Blob([content], { type: 'text/markdown; charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
