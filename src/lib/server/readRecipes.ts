import path from 'node:path'
import { parse } from 'yaml'
import { promises as fs } from 'node:fs'
import {
  type MarkdownRecipe,
  type Recipe,
  RecipeContentFormat,
  type RecipeMetadata,
  RecipeMetaDataSchema,
} from './recipeModel'

enum InitializingStatus {
  Initializing,
  Initialized,
}

const postsContainer: Record<string, Recipe[]> = {}
const dirInitStatus: Record<string, InitializingStatus> = {}

export const readRecipes = async (dir: string): Promise<Recipe[]> => {
  switch (dirInitStatus[dir]) {
    case InitializingStatus.Initialized:
      return postsContainer[dir] || []
    case InitializingStatus.Initializing:
      while (dirInitStatus[dir] === InitializingStatus.Initializing) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      return postsContainer[dir] || []
    default:
      dirInitStatus[dir] = InitializingStatus.Initializing
  }

  const start = Date.now()
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
  dirInitStatus[dir] = InitializingStatus.Initialized
  console.log(`${recipes.length} recipes found in ${dir} in ${Date.now() - start}ms`)
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
  const metadata = RecipeMetaDataSchema.parse(parsed)
  return metadata
}

const getRecipeFormat = (fileSuffix: string): RecipeContentFormat => {
  switch (fileSuffix.toLowerCase()) {
    case 'md':
      return RecipeContentFormat.Markdown
    default:
      return RecipeContentFormat.Unknown
  }
}
