import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  server: {
    host: true, // Esto expone la app en tu IP local (ej. 192.168.1.X)
    port: 5173,
  },
  plugins: [
    react(),
    basicSsl(), // Activa el HTTPS falso para engañar al móvil
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // Permite probar la PWA mientras desarrollamos
      },
      manifest: {
        name: 'TriniGlass App',
        short_name: 'TriniGlass',
        description: 'Gestión ágil de almacén para Cristalería Trinidad',
        theme_color: '#ffffff', // Cámbiar por el color principal de la UI
        background_color: '#ffffff',
        display: 'standalone', // Hace que parezca una app nativa sin barra de direcciones
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});