import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    watch: {
      // Windows can lock freshly downloaded TTF files and crash Vite's watcher.
      ignored: ['**/public/fonts/**'],
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'fonts/*.ttf'],
      manifest: {
        name: 'NextGame',
        short_name: 'NextGame',
        description: 'Feed vertical de minijuegos',
        theme_color: '#0f0f1a',
        background_color: '#0f0f1a',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png,ttf}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
})
