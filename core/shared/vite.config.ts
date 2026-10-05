import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import solid from 'vite-plugin-solid'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    solid(),
    dts({
      entryRoot: resolve(import.meta.dirname, 'src'),
      outDir: 'dist',
      insertTypesEntry: true,
      tsconfigPath: resolve(import.meta.dirname, 'tsconfig.json'),
    }),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'NplLib',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['solid-js', 'solid-js/web', '@npl/shared'],
    },
  },
})
