import cooklang, {
  Cookware,
  Ingredient,
  Metadata,
  Step,
} from "@cooklang/cooklang-ts";

export enum RecipeContentFormat {
  Markdown,
  Cooklang,
  Unknown,
}

export type RecipeMetadata = {
  title: string;
  servings?: number;
  lang?: "FI" | "fi" | "EN" | "en";
  tags: string[];
};

export type RecipeBase = {
  id: string;
  title: string;
  path: string;
  metadata: RecipeMetadata;
  format: RecipeContentFormat;
};

export type MarkdownRecipe = RecipeBase & {
  content: string;
};

export type CooklangRecipeContent = {
  ingredients: Array<Ingredient>;
  cookwares: Array<Cookware>;
  metadata: Metadata;
  steps: Array<Step>;
};

export type CooklangRecipe = RecipeBase & {
  content: cooklang.Recipe;
};

export type Recipe = MarkdownRecipe | CooklangRecipe;
