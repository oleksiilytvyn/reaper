import path from "path";
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig(({ command, mode }) => {
   const isDev = mode === 'development';

   return {
      plugins: [
         solidPlugin(),
         isDev ? null : legacy({ targets: ['defaults'] })
      ],
      resolve: {
         alias: {
            '~': path.resolve(__dirname, 'src')
         }
      },
      server: {
         port: 3000,
         proxy: {
            "/_": {
               // Reaper host URL, used while in dev mode
               target: "http://127.0.0.1:8080",
               changeOrigin: true,
               secure: false
            }
         }
      },
      build: {
         target: 'es2015',
         terserOptions: {
            compress: true,
         },
         outDir: './dist',
         emptyOutDir: true,
         rollupOptions: {
            input: command === 'serve'
               ? path.resolve(__dirname, 'index.html')
               : path.resolve(__dirname, 'lyrics.html'),
            output: {
               entryFileNames: 'lyrics/[name].js',
               chunkFileNames: 'lyrics/[name].js',
               assetFileNames: 'lyrics/[name].[ext]'
            }
         }
      },
   }
});
