import { useCallback, useRef } from 'react'
import type { Lens, LensOutput } from '../types'
import { DEFAULT_LENSES } from '../lib/lenses'

type SetOutput = (lensId: string, updater: (prev: LensOutput) => LensOutput) => void

/** localStorage の欠損などで description が空のときも API に必ず非空文字列を送る */
function resolveSystemPrompt(lens: Lens): string {
  const raw = lens.description
  if (typeof raw === 'string' && raw.trim().length > 0) return raw
  const fallback = DEFAULT_LENSES.find((d) => d.id === lens.id)?.description
  if (fallback && fallback.trim().length > 0) return fallback
  return '与えられた素材に基づき、この視点でメモを書いてください。'
}

/**
 * 1視点分の SSE ストリーミングを管理するカスタムフック。
 * - 各レンズは独立して動作し、1つが失敗しても他には影響しない。
 * - 「全レンズ生成」は API レート制限を避けるため順次実行する。
 * - AbortController でキャンセル可能。
 */
export function useStreamingLens(setOutput: SetOutput) {
  const abortControllers = useRef<Map<string, AbortController>>(new Map())

  const generateLens = useCallback(
    async (lens: Lens, material: string) => {
      // 同一レンズの既存リクエストをキャンセル
      abortControllers.current.get(lens.id)?.abort()
      const controller = new AbortController()
      abortControllers.current.set(lens.id, controller)

      setOutput(lens.id, () => ({
        lensId: lens.id,
        content: '',
        status: 'streaming',
        error: undefined,
      }))

      try {
        const systemPrompt = resolveSystemPrompt(lens)
        // undefined は JSON.stringify でキーごと落ちるため常に文字列化する
        const payload = JSON.stringify({
          material: String(material ?? ''),
          systemPrompt: String(systemPrompt ?? ''),
        })
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          signal: controller.signal,
        })

        if (!response.ok) {
          const text = await response.text()
          let errorMessage = `HTTP ${response.status}`
          try {
            const json = JSON.parse(text) as { error?: string }
            if (json.error) errorMessage = json.error
          } catch {
            // ignore
          }
          throw new Error(errorMessage)
        }

        if (!response.body) throw new Error('レスポンスボディがありません')

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          // 最後の不完全行をバッファに残す
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const data = trimmed.slice(5).trim()
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string } }>
              }
              const delta = parsed?.choices?.[0]?.delta?.content
              if (typeof delta === 'string' && delta.length > 0) {
                setOutput(lens.id, (prev) => ({
                  ...prev,
                  content: prev.content + delta,
                }))
              }
            } catch {
              // 不正な JSON チャンクは無視して続行
            }
          }
        }

        setOutput(lens.id, (prev) => ({ ...prev, status: 'done' }))
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        const message = err instanceof Error ? err.message : '不明なエラー'
        setOutput(lens.id, () => ({
          lensId: lens.id,
          content: '',
          status: 'error',
          error: message,
        }))
      } finally {
        abortControllers.current.delete(lens.id)
      }
    },
    [setOutput],
  )

  /** 全レンズを順に生成（同時多発は智谱の 429 になりやすい） */
  const generateAll = useCallback(
    async (lenses: Lens[], material: string) => {
      for (const lens of lenses) {
        await generateLens(lens, material)
      }
    },
    [generateLens],
  )

  /** 指定レンズ（省略時は全て）の生成をキャンセル */
  const cancel = useCallback((lensId?: string) => {
    if (lensId) {
      abortControllers.current.get(lensId)?.abort()
    } else {
      for (const controller of abortControllers.current.values()) {
        controller.abort()
      }
    }
  }, [])

  return { generateLens, generateAll, cancel }
}
