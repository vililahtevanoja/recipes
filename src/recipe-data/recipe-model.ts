import cooklang from "@cooklang/cooklang-ts"

export enum RecipeContentFormat {
  Markdown,
  Cooklang,
  Unknown
}

export type RecipeMetadata = {
  title: string,
  servings?: number,
  lang?: "FI" | "fi" | "EN" | "en"
  tags: string[]
}

export type RecipeBase = {
  id: string;
  title: string,
  path: string;
  metadata: RecipeMetadata
  format: RecipeContentFormat
};

export type MarkdownRecipe = RecipeBase & {
  content: string
}

export type CooklangRecipe = RecipeBase & {
  content: cooklang.Recipe
}

export type Recipe = MarkdownRecipe | CooklangRecipe
