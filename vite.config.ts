import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, type Plugin, type ViteDevServer } from 'vite'
import path from 'node:path'
import process from 'node:process'

const recipeRoot = path.resolve('recipes')

const isRecipePath = (file: string): boolean => {
  const resolved = path.resolve(file)
  return resolved === recipeRoot || resolved.startsWith(`${recipeRoot}${path.sep}`)
}

const clearRecipeCache = async (server: ViteDevServer): Promise<void> => {
  const module = (await server.ssrLoadModule('/src/lib/server/readRecipes.ts')) as {
    clearRecipeCache?: () => void
  }
  module.clearRecipeCache?.()
}

const handleRecipeChange = async (server: ViteDevServer, file: string): Promise<boolean> => {
  if (!isRecipePath(file)) {
    return false
  }
  await clearRecipeCache(server)
  server.ws.send({ type: 'full-reload' })
  return true
}

const recipeHmrPlugin = (): Plugin => ({
  name: 'recipe-hmr',
  configureServer(server) {
    server.watcher.on('add', (file) => {
      void handleRecipeChange(server, file)
    })
    server.watcher.on('unlink', (file) => {
      void handleRecipeChange(server, file)
    })
  },
  async handleHotUpdate(ctx) {
    if (!(await handleRecipeChange(ctx.server, ctx.file))) {
      return
    }
    return []
  },
})

export default defineConfig({
  plugins: [recipeHmrPlugin(), sveltekit()],
  define: {
    __GH_PAGES__: process.env.GH_PAGES,
  },
})
