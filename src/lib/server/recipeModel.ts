export enum RecipeContentFormat {
  Markdown,
  Unknown,
}

export type RecipeLanguage = 'fi' | 'en'

export type RecipeMetadata = {
  title: string
  servings?: number
  lang: RecipeLanguage
  tags: string[]
}

export type RecipeBase = {
  id: string
  title: string
  path: string
  metadata: RecipeMetadata
  format: RecipeContentFormat
}

export type MarkdownRecipe = RecipeBase & {
  content: string
}

export type Recipe = MarkdownRecipe
