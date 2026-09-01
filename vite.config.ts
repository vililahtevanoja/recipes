import { sveltekit } from '@sveltejs/kit/vite'
import { searchForWorkspaceRoot, type Plugin, type ViteDevServer } from 'vite'
import { defineConfig } from 'vitest/config'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'

const recipeRoot = path.resolve('recipes')
const require = createRequire(import.meta.url)
const svelteKitPackageRoot = path.dirname(require.resolve('@sveltejs/kit/package.json'))
const svelteKitRealPath = fs.realpathSync(svelteKitPackageRoot)

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
  test: {
    include: ['src/**/*.test.ts'],
  },
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), svelteKitRealPath],
    },
  },
  define: {
    __GH_PAGES__: process.env.GH_PAGES,
  },
})
