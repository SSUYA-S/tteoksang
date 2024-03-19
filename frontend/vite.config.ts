import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
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
                scope: '/',
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
});
