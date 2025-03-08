import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig((config) => {
   const dev = config.mode === 'development';

   return {
      build: {
         sourcemap: dev,
         lib: { entry: resolve(__dirname, 'src/index.ts'), formats: ['es', 'cjs'] }
      },
      resolve: { alias: { '~': resolve(__dirname, 'src/') } },
      plugins: [dts()]
   }
})
