import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import solid from 'vite-plugin-solid'
import dts from 'vite-plugin-dts'
export default defineConfig({
  plugins: [solid(), dts({ entryRoot: 'src', outDir: 'dist', insertTypesEntry: true })],
  build: {
    lib: { entry: resolve(import.meta.dirname, 'src/index.ts'), name: 'NplRouter', fileName: 'index', formats: ['es'] },
    rolldownOptions: { external: ['solid-js', 'solid-js/web', '@npl/shared'] }
  }
})
