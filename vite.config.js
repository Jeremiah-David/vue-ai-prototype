import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: process.env.NODE_ENV === 'production' ? '/vue-ai-prototype/' : '/',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    css: {
        postcss: './postcss.config.js',
    },
})
