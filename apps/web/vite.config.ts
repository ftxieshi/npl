import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import solid from 'vite-plugin-solid'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [solid(), UnoCSS()],
  server: {
    fs: {
      allow: [resolve(import.meta.dirname, '../..')],
    },
  },
})
