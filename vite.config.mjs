import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: []
    }
  },
  server: {
    // Désactiver le favicon par défaut de Vite
    middlewareMode: false
  }
})
