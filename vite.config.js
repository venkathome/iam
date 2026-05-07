import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 12000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@apollo') || id.includes('graphql')) return 'apollo'
            return 'vendor'
          }
          if (id.includes('/src/data/pictureData') || id.includes('/src/data/tmp_')) return 'picture-data'
          if (id.includes('/src/data/')) return 'therapy-data'
        },
      },
    },
  },
})
