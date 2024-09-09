import path from 'node:path'
import { parse } from 'yaml'
import { promises as fs } from 'node:fs'
import { type MarkdownRecipe, type Recipe, RecipeContentFormat, type RecipeMetadata } from './recipeModel'

const postsContainer: Record<string, Recipe[]> = {}

export const readRecipes = async (dir: string): Promise<Recipe[]> => {
  const readRecipesInner = async (dir: string): Promise<Recipe[]> => {
    const files = await fs.readdir(dir, { encoding: 'utf-8' })
    const recipes = await Promise.all(
      files.map(async (f) => {
        const filePath = path.join(dir, f)
        const isDir = (await fs.lstat(filePath)).isDirectory()
        if (isDir) {
          return readRecipesInner(filePath)
        }
        return readRecipeFile(filePath).catch((err) => {
          console.error(`Error while reading ${filePath}: `, err)
          return undefined
        })
      }),
    )
    const allRecipes = recipes.flat().filter((item): item is Recipe => !!item)
    return allRecipes
  }
  if (postsContainer[dir]) {
    return postsContainer[dir]
  }
  const recipes = await readRecipesInner(dir)
  if (!postsContainer[dir]) {
    postsContainer[dir] = [...recipes]
  }
  console.log(`Recipes found: ${recipes.length}`)
  return recipes
}

export const readRecipeFile = async (filePath: string): Promise<Recipe | undefined> => {
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const name = path.basename(filePath).split('.')[0]
  const fileType = filePath.split('.').at(-1)
  const format = getRecipeFormat(fileType ?? '')
  if (format === RecipeContentFormat.Markdown) {
    const metadata = getMetadataFromMarkdownRecipe(fileContent)
    const recipeContent = getRecipeMarkdownWithoutMetadataHeader(fileContent)
    return {
      id: name,
      title: metadata.title,
      format,
      content: recipeContent,
      path: filePath,
      metadata,
    } as MarkdownRecipe
  } else {
    throw new Error(`Unknown file format for ${filePath}`)
  }
}

const tagStrToList = (tags: string): string[] => tags.split(',').map((s) => s.trim())

const getRecipeMarkdownWithoutMetadataHeader = (content: string): string => {
  if (!content.startsWith('---')) {
    throw new Error(
      `Expecting Markdown file to start with "---" yaml section, but instead starts with ${content.split('\n')[0]}`,
    )
  }
  const yamlCloserIdx = content.indexOf('---', 3)
  if (yamlCloserIdx < 0) {
    throw new Error('Expected yaml section closer, but not found')
  }
  const recipeSection = content.slice(yamlCloserIdx)
  return recipeSection
}

const getMetadataFromMarkdownRecipe = (content: string): RecipeMetadata => {
  if (!content.startsWith('---')) {
    throw new Error(
      `Expecting Markdown file to start with "---" yaml section, but instead starts with ${content.split('\n')[0]}`,
    )
  }
  const yamlCloserIdx = content.indexOf('---', 3)
  if (yamlCloserIdx < 0) {
    throw new Error('Expected yaml section closer, but not found')
  }
  const yamlSection = content.slice(3, yamlCloserIdx)
  const parsed = parse(yamlSection)
  const tags = tagStrToList(parsed.tags)
  if (!parsed.title || !Array.isArray(tags) || tags.length === 0) {
    throw new Error(`Title or tags not found in parsed yaml-section: ${parsed}`)
  }
  return { title: parsed.title, tags, ...parsed }
}

const getRecipeFormat = (fileSuffix: string): RecipeContentFormat => {
  switch (fileSuffix.toLowerCase()) {
    case 'md':
      return RecipeContentFormat.Markdown
    default:
      return RecipeContentFormat.Unknown
  }
}

const isMarkdownRecipe = (recipe: Recipe): recipe is MarkdownRecipe =>
  typeof (recipe as MarkdownRecipe).content === 'string'
