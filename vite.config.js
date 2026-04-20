import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        clock: resolve(import.meta.dirname, './src/pages/clock/clock.html'),
        mins: resolve(import.meta.dirname, './src/pages/waking_minutes/waking_minutes.html'),
      },
    },
  },
})
