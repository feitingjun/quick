import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fileRouter from '@quick/vite-plugin-file-router'

export default defineConfig({
  plugins: [react(), tailwindcss(), fileRouter()]
})
