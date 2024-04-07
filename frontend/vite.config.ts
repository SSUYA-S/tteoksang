import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            injectRegister: null,
            registerType: 'prompt',
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
                globPatterns: ['**/*.{js,tsx,ts,tsx,css,html,ico,png,svg}'],
            },
            manifest: {
                name: '떡상',
                short_name: '떡상',
                description: '최고의 상인이 되어보세요!',
                theme_color: '#ffffff',
                start_url: '/',
                display: 'fullscreen',
                orientation: 'landscape',
                lang: 'ko-KR',
                icons: [
                    {
                        src: '/icons/icon-192.png',
                        type: 'image/png',
                        sizes: '192x192',
                    },
                    {
                        src: '/icons/icon-512.png',
                        type: 'image/png',
                        sizes: '512x512',
                    },
                ],
            },
        }),
    ],
    //proxy settings
    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8080/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    //env idr
    envDir: '../',
});
