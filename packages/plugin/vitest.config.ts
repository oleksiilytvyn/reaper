import { defineConfig } from 'vitest/config'

export default defineConfig({
   test: {
      environment: 'jsdom',
      include: [
         "**/__tests__/**/*.+(ts|tsx|js)",
         "**/?(*.)+(spec|test).+(ts|tsx|js)"
      ],
      exclude: [
         '**/dist/**',
         '**/cypress/**',
         '**/node_modules/**',
         '**/.{idea,git,cache,output,temp}/**',
         '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
      ]
   },
});