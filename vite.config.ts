import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import replace from "@rollup/plugin-replace";
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa'

const production = 'import.meta.env.PROD';

// https://vitejs.dev/config/
export default {
    optimizeDeps: { exclude: ["svelte-navigator"] },
    plugins: [
        replace({
            isProduction: production,
        }),
        svelte({}),
        VitePWA({ registerType: 'autoUpdate', devOptions: {
                enabled: true,
                type: 'module',
            }, }),
        viteCompression(),
    ],
};
