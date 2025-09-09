import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSourceLocator } from '@metagptx/vite-plugin-source-locator'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteSourceLocator({
    prefix: 'mgx'
  }), react()],
  server:{
    proxy:{
      '\api':'https://rate-my-shop-backend-8yul0i8p2-sujals-projects-49d7a6f5.vercel.app'
    }
  }
})
