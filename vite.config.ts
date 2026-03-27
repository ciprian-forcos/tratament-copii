import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { resolve } from 'path'

function swCacheVersionPlugin(): Plugin {
  return {
    name: 'sw-cache-version',
    closeBundle() {
      const distAssets = resolve('dist', 'assets')
      const swPath = resolve('sw.js')

      let hash = ''
      try {
        const files = readdirSync(distAssets)
        const jsFile = files.find((f: string) => /-[A-Za-z0-9_-]{8,}\.js$/.test(f))
        if (jsFile) {
          const match = jsFile.match(/-([A-Za-z0-9_-]+)\.js$/)
          if (match) hash = match[1]
        }
      } catch {
        // dist/assets not found (e.g. watch mode)
      }

      if (!hash) return

      try {
        const sw = readFileSync(swPath, 'utf-8')
        const updated = sw.replace(
          /const CACHE_NAME = 'tratament-copii-[^']+'/,
          `const CACHE_NAME = 'tratament-copii-${hash}'`
        )
        if (updated !== sw) {
          writeFileSync(swPath, updated)
          console.log(`[sw-cache-version] cache name → tratament-copii-${hash}`)
        }
      } catch {
        // sw.js not present — skip
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), swCacheVersionPlugin()],
  base: '/tratament-copii/',
  build: {
    outDir: 'dist',
  },
})
