import { defineConfig } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// #region agent log
const AGENT_DEBUG_SESSION = 'f07629'
const AGENT_INGEST = 'http://127.0.0.1:7293/ingest/a3e16a20-f73d-49e9-9bb6-a627b038e1f0'

function agentLog(
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string,
) {
  fetch(AGENT_INGEST, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': AGENT_DEBUG_SESSION },
    body: JSON.stringify({
      sessionId: AGENT_DEBUG_SESSION,
      location,
      message,
      data,
      timestamp: Date.now(),
      hypothesisId,
      runId: 'pre-fix',
    }),
  }).catch(() => {})
}

function debugProxyInstrumentPlugin(): Plugin {
  return {
    name: 'debug-proxy-instrument',
    configureServer() {
      // #region agent log
      agentLog(
        'vite.config.ts:configureServer',
        'vite dev server started',
        { proxyTarget: 'http://localhost:8788', proxyPath: '/api' },
        'H2',
      )
      // #endregion
    },
  }
}
// #endregion

export default defineConfig({
  plugins: [react(), debugProxyInstrumentPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes, req) => {
            // #region agent log
            agentLog(
              'vite.config.ts:proxy:proxyRes',
              'proxy got response from upstream',
              { statusCode: proxyRes.statusCode, reqUrl: req.url },
              'H5',
            )
            // #endregion
          })
          proxy.on(
            'error',
            (err: Error, req: IncomingMessage, res: ServerResponse | import('net').Socket) => {
              // #region agent log
              const base = { reqUrl: req.url, errMessage: err.message, errName: err.name }
              if (err instanceof AggregateError && err.errors?.length) {
                const child = err.errors.map((e, i) => {
                  const ce = e as NodeJS.ErrnoException
                  return { i, code: ce.code, message: ce.message, address: ce.address, port: ce.port }
                })
                agentLog(
                  'vite.config.ts:proxy:error',
                  'proxy upstream error (aggregate)',
                  { ...base, aggregateChildErrors: child },
                  'H4',
                )
              } else {
                const ne = err as NodeJS.ErrnoException
                agentLog(
                  'vite.config.ts:proxy:error',
                  'proxy upstream error',
                  { ...base, code: ne.code, address: ne.address, port: ne.port },
                  'H1',
                )
              }
              // #endregion
            },
          )
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
