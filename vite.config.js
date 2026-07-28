import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/TCC-Sistema-de-analise-dos-indicadores-da-atencao-primaria/',
  plugins: [react(), tailwindcss()],
})



