import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  envPrefix: 'VITE_' // Ensure this line is present to use VITE_ prefixed environment variables
})
