import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fileRouter from '@quick/vite-plugin-file-router'

export default defineConfig({
  plugins: [react(), fileRouter()]
})
