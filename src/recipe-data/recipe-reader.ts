import path from 'path'
import { parse } from 'yaml'
import { promises as fs } from 'fs'
import { Recipe as _CooklangRecipe } from '@cooklang/cooklang-ts'
import {
  CooklangRecipe,
  CooklangRecipeContent,
  MarkdownRecipe,
  Recipe,
  RecipeContentFormat,
  RecipeMetadata,
} from './recipe-model'

const postsContainer: Record<string, Recipe[]> = {}

export const readRecipes = async (dir: string): Promise<Recipe[]> => {
  const readRecipesInner = async (dir: string): Promise<Recipe[]> => {
    const files = await fs.readdir(dir, { encoding: 'utf-8' })
    const recipes = await Promise.all(
      files.flatMap(async (f) => {
        const filePath = path.join(dir, f)
        console.log(filePath)
        const isDir = (await fs.lstat(filePath)).isDirectory()
        if (isDir) {
          return await readRecipesInner(filePath)
        }
        try {
          return await readRecipeFile(filePath)
        } catch (err) {
          console.error(`Error while reading ${filePath}: `, err)
          return undefined
        }
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

export const readRecipeFile = async (filePath: string): Promise<Recipe> => {
  const content = await fs.readFile(filePath, 'utf-8')
  const name = path.basename(filePath).split('.')[0]
  const fileType = filePath.split('.').at(-1)
  const format = getRecipeFormat(fileType ?? '')
  if (format === RecipeContentFormat.Markdown) {
    const metadata = getMetadataFromMarkdownRecipe(content)
    return {
      id: name,
      title: metadata.title,
      format,
      content,
      path: filePath,
      metadata,
    } as MarkdownRecipe
  } else if (format === RecipeContentFormat.Cooklang) {
    const recipe = new _CooklangRecipe(content)
    const metadata = getMetadataFromCooklangRecipe(recipe)
    const cooklangRecipeContent: CooklangRecipeContent = {
      ingredients: recipe.ingredients,
      cookwares: recipe.cookwares,
      metadata: recipe.metadata,
      steps: recipe.steps,
    }
    return {
      id: name,
      title: metadata.title,
      format,
      content: cooklangRecipeContent,
      path: filePath,
      metadata,
    } as CooklangRecipe
  } else {
    throw new Error(`Unknown file format for ${filePath}`)
  }
}

const tagStrToList = (tags: string): string[] =>
  tags.split(',').map((s) => s.trim())

const getMetadataFromCooklangRecipe = (
  recipe: _CooklangRecipe,
): RecipeMetadata => {
  const tags = tagStrToList(recipe.metadata.tags ?? '')
  if (!recipe.metadata.title || recipe.metadata.tags.length === 0) {
    throw new Error(
      `Recipe title or metadata not defined: ${JSON.stringify(recipe)}`,
    )
  }
  return {
    title: recipe.metadata.title,
    tags,
    ...recipe.metadata,
  } as RecipeMetadata
}

const getMetadataFromMarkdownRecipe = (content: string): RecipeMetadata => {
  if (!content.startsWith('---')) {
    throw new Error(
      `Expecting Markdown file to start with "---" yaml section, but instead starts with ${
        content.split('\n')[0]
      }`,
    )
  }
  const yamlCloserIdx = content.indexOf('---', 3)
  if (yamlCloserIdx < 0) {
    throw new Error('Expected yaml section closer, but not found')
  }
  const yamlSection = content.slice(3, yamlCloserIdx)
  console.log(`yaml section: \n${yamlSection}`)
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
    case 'cook':
      return RecipeContentFormat.Cooklang
    default:
      return RecipeContentFormat.Unknown
  }
}

const isMarkdownRecipe = (recipe: Recipe): recipe is MarkdownRecipe =>
  typeof (recipe as MarkdownRecipe).content === 'string'

export const getRecipeMarkdown = (recipe: Recipe): string => {
  if (isMarkdownRecipe(recipe)) {
    return recipe.content
  } else {
    return JSON.stringify(recipe.content, undefined, 2).replace('\n', '\n\n')
  }
}
