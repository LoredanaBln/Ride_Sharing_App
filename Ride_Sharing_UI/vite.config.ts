import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: true
    },
    resolve: {
        alias: {
            global: 'window'
        }
    },
    define: {
        global: 'window'
    },
    assetsInclude: ['**/*.png', '**/*.jpg']
})