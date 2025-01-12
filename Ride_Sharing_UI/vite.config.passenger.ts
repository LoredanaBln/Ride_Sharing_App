import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5174,
        host: true,
        open: true
    },
    resolve: {
        alias: {
            global: 'window'
        }
    },
    define: {
        global: 'window',
        APP_TYPE: JSON.stringify('passenger')
    },
    assetsInclude: ['**/*.png', '**/*.jpg']
})
