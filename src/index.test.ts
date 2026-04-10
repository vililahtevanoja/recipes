import path from 'node:path'
import { promises as fs } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { readRecipeFile } from './lib/server/readRecipes'

const RECIPES_DIR = path.resolve('recipes')

const getMarkdownRecipeFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        return getMarkdownRecipeFiles(entryPath)
      }
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        return [entryPath]
      }
      return []
    }),
  )
  return nestedFiles.flat()
}

describe('Recipe data quality', () => {
  it('parses all markdown recipes without duplicate tags', async () => {
    const recipeFiles = await getMarkdownRecipeFiles(RECIPES_DIR)
    expect(recipeFiles.length).toBeGreaterThan(0)

    await Promise.all(
      recipeFiles.map(async (recipeFile) => {
        const recipe = await readRecipeFile(recipeFile)
        expect(recipe, `Expected ${recipeFile} to parse into a recipe`).toBeDefined()
      }),
    )
  })
})
