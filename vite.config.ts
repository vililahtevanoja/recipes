import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import process from 'node:process'

export default defineConfig({
  plugins: [sveltekit()],
  define: {
    __GH_PAGES__: process.env.GH_PAGES,
  },
})
